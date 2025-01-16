import { Link } from "react-router-dom"
import { FaExclamationTriangle } from "react-icons/fa"

const NotAuthorized = () => {
  return (
    <section className='text-center flex flex-col justify-center items-center h-96'>
      <FaExclamationTriangle className='text-red-900 text-6xl mb-4' />
      <h1 className='text-6xl font-bold mb-4'>Not Authorized</h1>
      <p className='text-xl mb-5'>You don't have access on this page</p>
      <p className='text-xl mb-5'>Please contact your administrator</p>
      <Link
        to='/dashboard/overview'
        className='text-white bg-red-800 hover:bg-red-900 rounded-md px-3 py-2 mt-4'
      >
        Go Back
      </Link>
    </section>
  )
}
export default NotAuthorized
