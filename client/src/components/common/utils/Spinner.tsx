import ClipLoader from "react-spinners/ClipLoader"

const override = {
  display: "block",
  margin: "100px auto",
}

const Spinner = ({ loading }: any) => {
  return (
    <ClipLoader
      color='#7f1d1d'
      loading={loading}
      cssOverride={override}
      size={250}
    />
  )
}
export default Spinner
