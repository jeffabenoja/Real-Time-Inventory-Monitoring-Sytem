import Button from "./Button";
import timeAgo from "../../utils/timeAgo";
import { Notification } from "../../type/notifications";

export default function Item({message, timestamp} : Notification) {

  return (
    <div className="w-full">
      <p className="font-semibold">
        {message}
      </p>
      <p className="text-sm text-primary">{timeAgo(timestamp)}</p>
      <div className="flex justify-end">
        <Button text="Accept" accept />
        <Button text="Reject" accept={false} />
      </div>
    </div>
  );
}