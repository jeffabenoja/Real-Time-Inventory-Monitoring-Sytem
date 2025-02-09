import ClipLoader from "react-spinners/ClipLoader"

const override = {
  display: "block",
  margin: "100px auto",
}

const Spinner = ({ loading }: any) => {
  return (
    <ClipLoader
      color='#3B82F6'
      loading={loading}
      cssOverride={override}
      size={250}
    />
  )
}
export default Spinner
