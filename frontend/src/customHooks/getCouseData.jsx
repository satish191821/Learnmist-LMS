import { toast } from 'sonner';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setCourseData } from '../redux/courseSlice.js';
import { useEffect } from 'react';

const getCouseData = () => {
  const dispatch = useDispatch()

  useEffect(()=>{
    const getAllPublishedCourse = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getpublishedcoures" , {withCredentials:true})
        dispatch(setCourseData(result.data))
        // console.log(result.data)
      } catch (error) {
        toast.error("Failed to load courses")
        // console.log(error)
      }
    }
    getAllPublishedCourse()
  },[])

}

export default getCouseData


