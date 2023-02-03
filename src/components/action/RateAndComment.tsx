import { Button, Input, Rate } from "antd";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import styles from "./RateAndComment.module.css";
const { TextArea } = Input;

const RateAndComment = ({
  rating,
  comment,
  onRateChange,
  onCommentChange,
  onRateCommentSubmit,
}: {
  rating: number | null | undefined;
  comment: string | null | undefined;
  onRateChange: ((value: number) => void) | undefined;
  onCommentChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onRateCommentSubmit:
    | (MouseEventHandler<HTMLAnchorElement> &
        MouseEventHandler<HTMLButtonElement>)
    | undefined;
}) => {
  return (
    <div className={styles.userRating}>
      <div>
        <Rate onChange={onRateChange} defaultValue={rating ?? 5} />
      </div>
      <div>
        <TextArea
          style={{ width: 400, marginBottom: 24 }}
          placeholder="Add a comment to this movie..."
          onChange={onCommentChange}
          defaultValue={comment ? comment : ""}
          showCount
        />
      </div>
      <div>
        <Button type="primary" onClick={onRateCommentSubmit}>
          Rate
        </Button>
      </div>
    </div>
  );
};

export default RateAndComment;
