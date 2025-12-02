import {Table,Label,Input,Button} from 'reactstrap'
import { useState } from 'react'
import { baseUrl, myAxios } from '../config.jsx'
import { userAtom } from '../atoms.jsx'
import { useAtom, useSetAtom, useAtomValue } from 'jotai/react'
import { useNavigate } from 'react-router'

export default function Login() {
    const [id, setId] = useState("")
    const [password, setPassword] = useState("");
    const setUser = useSetAtom(userAtom);
    const navigate = useNavigate();

    const divStyle = {
        margin:"0 auto",
        width:'400px',
        border:'1px solid lightgray',
        borderRadius:'10px',
        padding:'10px'
    }

    const submit = () => {
        let formData = new FormData();
        formData.append('id', id)
        formData.append('password', password)
        myAxios().post(`/login`, formData)
            .then(res=> {
                if(res.data) {
                    setUser(res.data);
                }
                navigate("/");
            })
            .catch(err=> {
                console.log(err)
                alert(err.response.data.message);
            })
    }
    return(
        <>
            {/* <div className='header-text'>로그인</div> */}
            <div style={divStyle}>
                <Table borderless>
                    <tbody>
                        <tr>
                            <td><Label>아이디</Label></td>
                            <td><Input type="text" name="username" onChange={(e)=>setId(e.target.value)}/></td>
                        </tr>
                        <tr>
                            <td><Label>비밀번호</Label></td>
                            <td><Input type="password" name="password" onChange={(e)=>setPassword(e.target.value)}/></td>
                        </tr>
                        <tr>
                           <td colSpan={2} >
                                <Button color="primary" style={{width:"100%"}} onClick={submit}>로그인</Button>
                           </td>
                        </tr>
                    </tbody>
                </Table>

            </div>
        </>
    )
}