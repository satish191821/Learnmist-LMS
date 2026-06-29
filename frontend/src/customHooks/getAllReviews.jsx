import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setAllReview } from '../redux/reviewSlice'
import { toast } from 'sonner'
import axios from 'axios'

const getAllReviews = () => {

   const dispatch = useDispatch()
  

  useEffect(()=>{
    const getAllReviews = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/review/allReview" , {withCredentials:true})
        dispatch(setAllReview(result.data))
        // console.log(result.data)
      } catch (error) {
        toast.error("Failed to load reviews")
        // console.log(error)
      }
    }
    getAllReviews()
  },[])
  
}

export default getAllReviews
