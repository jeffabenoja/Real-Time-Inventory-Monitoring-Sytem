import timeAgo from "../../utils/timeAgo";
import { Notification } from "../../type/notifications";
import { useState } from "react";
import CustomModal from "../common/utils/CustomModal";

export default function Item({ message, timestamp }: Notification) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="w-full">
        <p className="font-semibold">{message}</p>
        <p className="text-sm text-primary">{timeAgo(timestamp)}</p>
      </div>
    </>
  );
}
