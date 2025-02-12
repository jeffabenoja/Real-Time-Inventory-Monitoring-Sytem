interface Props {
    text: string
    accept: boolean
}

export default function Button({ text, accept }: Props) {
    return (
      <button
        className={`${
          accept ? "text-primary" : "text-red-400"
        } font-semibold w-20`}
      >
        {text}
      </button>
    );
  }
  