import { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory, updateMessage, deleteMessage, getChatUsers } from '../../Service/Client/ApiChatbox';
import { format } from 'date-fns';
import { Send, MoreVertical, User, X, Edit2, Trash2 } from 'lucide-react';
import { Avatar, Input, Button, List, Badge, Modal, Spin, message, Dropdown, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

const Chatbox = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [messageToDelete, setMessageToDelete] = useState(null);
    const messagesEndRef = useRef(null);
    
    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getChatUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedUser) {
            loadChatHistory();
        }
    }, [selectedUser]);

    const loadChatHistory = async () => {
        try {
            const data = await getChatHistory(selectedUser._id);
            // Sắp xếp tin nhắn theo thời gian từ cũ đến mới
            const sortedMessages = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(sortedMessages);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            await sendMessage(selectedUser._id, newMessage);
            setNewMessage('');
            loadChatHistory();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleUpdateMessage = async (messageId, newContent) => {
        try {
            await updateMessage(messageId, newContent);
            message.success('Message updated successfully');
            setEditingMessage(null);
            setEditContent('');
            loadChatHistory();
        } catch (error) {
            console.error('Error updating message:', error);
            message.error('Failed to update message');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteMessage(messageId);
            message.success('Message deleted successfully');
            setMessageToDelete(null);
            loadChatHistory();
        } catch (error) {
            console.error('Error deleting message:', error);
            message.error('Failed to delete message');
        }
    };

    const onUpdate = (message) => {
        setEditingMessage(message);
        setEditContent(message.content);
    };

    const onDelete = (message) => {
        setMessageToDelete(message);
    };

    const getMessageActions = (message) => {
        if (!message.isCurrentUser) return null;

        const items = [
            {
                key: 'edit',
                label: 'Edit message',
                icon: <Edit2 size={14} />,
                onClick: () => onUpdate(message)
            },
            {
                key: 'delete',
                label: 'Delete message',
                icon: <Trash2 size={14} />,
                danger: true,
                onClick: () => onDelete(message)
            }
        ];

        return (
            <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement="bottomRight"
            >
                <Button
                    type="text"
                    icon={<MoreVertical size={14} />}
                    style={{
                        opacity: 0.5,
                        transition: 'opacity 0.2s ease',
                        minWidth: '32px',
                        height: '32px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.5';
                    }}
                />
            </Dropdown>
        );
    };

    const modalStyles = {
        position: 'fixed',
        bottom: '100px',
        right: '30px',
        top: 'auto',
        margin: 0,
        padding: 0,
        transform: 'none !important',
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={800}
            style={modalStyles}
            styles={{
                body: { 
                    padding: 0,
                    height: '500px',
                    overflow: 'hidden'
                }
            }}
            mask={false}
            maskClosable={false}
            closable={false}
            destroyOnClose={true}
        >
            <div style={{ position: 'relative', height: '500px', display: 'flex' }}>
                {/* Close Button */}
                <Button
                    type="text"
                    icon={<X size={16} />}
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        zIndex: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #d9d9d9'
                    }}
                />

                {/* User List Sidebar */}
                <div style={{ 
                    width: '300px', 
                    borderRight: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fafafa'
                }}>
                    {/* Sidebar Header */}
                    <div style={{ 
                        padding: '16px',
                        borderBottom: '1px solid #f0f0f0',
                        backgroundColor: '#fff'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                            Users Online
                        </h3>
                    </div>

                    {/* Users List */}
                    <div style={{ 
                        flex: 1,
                        overflow: 'auto',
                        backgroundColor: '#fff'
                    }}>
                        {loading ? (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                height: '200px'
                            }}>
                                <Spin size="default" />
                            </div>
                        ) : (
                            <List
                                dataSource={users}
                                renderItem={(user) => (
                                    <List.Item
                                        style={{
                                            cursor: 'pointer',
                                            padding: '12px 16px',
                                            backgroundColor: selectedUser?._id === user._id ? '#e6f7ff' : 'transparent',
                                            borderLeft: selectedUser?._id === user._id ? '3px solid #1890ff' : '3px solid transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => setSelectedUser(user)}
                                        onMouseEnter={(e) => {
                                            if (selectedUser?._id !== user._id) {
                                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedUser?._id !== user._id) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    src={user.avatar}
                                                    style={{ backgroundColor: '#1890ff' }}
                                                    icon={<User size={16} />}
                                                />
                                            }
                                            title={
                                                <div style={{ 
                                                    fontSize: '14px', 
                                                    fontWeight: 500,
                                                    color: '#262626'
                                                }}>
                                                    {user.name}
                                                </div>
                                            }
                                            description={
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#8c8c8c',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {user.email}
                                                </div>
                                            }
                                        />
                                        <Badge status="success" />
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff'
                }}>
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ 
                                padding: '16px 20px',
                                borderBottom: '1px solid #f0f0f0',
                                backgroundColor: '#fafafa'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Avatar
                                        src={selectedUser.avatar}
                                        style={{ backgroundColor: '#1890ff' }}
                                        icon={<User size={16} />}
                                    />
                                    <div>
                                        <h3 style={{ 
                                            margin: 0, 
                                            fontSize: '16px', 
                                            fontWeight: 600,
                                            color: '#262626'
                                        }}>
                                            {selectedUser.name}
                                        </h3>
                                        <p style={{ 
                                            margin: 0, 
                                            fontSize: '12px', 
                                            color: '#8c8c8c' 
                                        }}>
                                            Online
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div style={{ 
                                flex: 1,
                                overflow: 'auto',
                                padding: '16px 20px',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {messages.map((message) => (
                                        <div
                                            key={message.id || message._id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                gap: '8px',
                                                justifyContent: message.isCurrentUser ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: '70%',
                                                    padding: '12px 16px',
                                                    borderRadius: '18px',
                                                    backgroundColor: message.isCurrentUser ? '#1890ff' : '#fff',
                                                    color: message.isCurrentUser ? '#fff' : '#262626',
                                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                                    position: 'relative'
                                                }}
                                            >
                                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', lineHeight: '1.4' }}>
                                                    {message.content}
                                                </p>
                                                <small style={{ 
                                                    fontSize: '11px', 
                                                    opacity: 0.7,
                                                    display: 'block'
                                                }}>
                                                    {format(new Date(message.timestamp), 'HH:mm')}
                                                    {message.updatedAt && ' (edited)'}
                                                </small>
                                            </div>
                                            {getMessageActions(message)}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Message Input */}
                            <form
                                onSubmit={handleSendMessage}
                                style={{
                                    padding: '16px 20px',
                                    borderTop: '1px solid #f0f0f0',
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'flex-end'
                                }}
                            >
                                <Input.TextArea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                    style={{ 
                                        flex: 1,
                                        borderRadius: '20px',
                                        padding: '8px 16px'
                                    }}
                                    onPressEnter={(e) => {
                                        if (!e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                                <Button
                                    type="primary"
                                    icon={<Send size={16} />}
                                    htmlType="submit"
                                    style={{
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    disabled={!newMessage.trim()}
                                />
                            </form>
                        </>
                    ) : (
                        <div style={{ 
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '16px',
                            color: '#8c8c8c'
                        }}>
                            <div style={{ 
                                fontSize: '48px',
                                opacity: 0.3
                            }}>
                                💬
                            </div>
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '18px', 
                                fontWeight: 500,
                                color: '#595959'
                            }}>
                                Select a user to start chatting
                            </h3>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '14px', 
                                color: '#8c8c8c',
                                textAlign: 'center'
                            }}>
                                Choose someone from the list to begin your conversation
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Message Modal */}
            <Modal
                title="Edit Message"
                open={!!editingMessage}
                onCancel={() => {
                    setEditingMessage(null);
                    setEditContent('');
                }}
                onOk={() => handleUpdateMessage(editingMessage.id || editingMessage._id, editContent)}
                okText="Save"
                cancelText="Cancel"
            >
                <Input.TextArea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    style={{ marginTop: '16px' }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Popconfirm
                title="Delete message"
                description="Are you sure you want to delete this message?"
                open={!!messageToDelete}
                onConfirm={() => handleDeleteMessage(messageToDelete?.id || messageToDelete?._id)}
                onCancel={() => setMessageToDelete(null)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
            />
        </Modal>
    );
};

Chatbox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Chatbox;