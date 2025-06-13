import Chat from "./components/Chat"

export default function ManagerChat() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Quản lý chat</h2>
        <p className="text-muted-foreground">
          Giao tiếp với nhân viên và khách hàng
        </p>
      </div>

      <Chat />
    </div>
  )
} 