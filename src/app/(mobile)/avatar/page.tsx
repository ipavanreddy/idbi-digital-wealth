import { Chat } from "@/components/avatar/Chat";

/** Avatar chat fills the whole screen area (input pinned to the bottom). */
export default function AvatarPage() {
  return (
    <div className="h-full">
      <Chat />
    </div>
  );
}
