import React, { useEffect, useRef } from 'react'
import Form, { FormActions, FormFields } from './Form'
import TextInput from './TextInput'
import FormController from '../../lib/FormController'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import Swal from 'sweetalert2'

const User = () => {
 const formRef = useRef();
    useEffect(() => {
    const controller = new FormController(formRef.current,{
    actions:{
       endpoint: async(payload)=>{
       return api.createResource("apiEndpoint",payload)
       },
    },
hooks:{
    onSuccess :()=>{
        Swal.fire(

        )
    }
}
    })
    
     return 
    }, [])
    
  return (
    <div>

        <Form apiAction="endpoint" ref={formRef} title="sample form here">
            <FormFields grid={1}>
                <TextInput
                name="sample"
                lable="sample"
                placeholde="enter sample"
               
                />
            </FormFields>
            <FormActions>
                <button type='submit' className=''>
                    submit
                </button>
            </FormActions>
        </Form>
    </div>
  )
}

export default User