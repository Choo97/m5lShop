import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { useState } from 'react';
import { myAxios } from '../config';

export default function Join() {
    const [user, setUser] = useState({id:'',name:'',password:'',email:'',address:''})
    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState('')

    const divStyle = {
        margin:"0 auto",
        width:'500px',
        border:'1px solid lightgray',
        borderRadius:'10px',
        padding:'23px'
    }

    const changeInput = (e) => {
        setUser({...user, [e.target.name]:e.target.value})
    }
    const submit = (e) => {
        e.preventDefault();
        myAxios().post(`/join`, user)
            .then(res=>{
                if(res.data==true) {
                    setMessage("회원가입 되었습니다.")
                } else {
                    setMessage("회원가입에 실패했습니다.")
                }
            })
            .catch(err=> {
                console.log(err)
                setMessage("회원가입 중 오류가 발생했습니다.")
            })
            .finally(()=>{
                setModal(true);
            })
    }

    const usernameCheck = (e) => {
        e.preventDefault();
        myAxios().post(`/doubleMemberId`, {memberId:user.id})
            .then(res=>res.data)
            .then(data=> {
                if(data==true) {
                    setMessage("사용중인 계좌번호입니다.");
                } else {
                    setMessage("사용 가능한 계좌번호입니다.");
                }
            })
            .catch(err=> {
                console.log(err)
            })
            .finally(()=> {
                setModal(true);
            })
    }
    return(
        <div className="route" >
            <div className='header-text'>회원가입</div>
            <Form onSubmit={submit} style={divStyle}>
                <FormGroup row>
                    <Label for="id" sm={3}>아이디</Label>
                    <Col sm={6}>
                        <Input type="text" name="id" id="id" onChange={changeInput}/>
                    </Col>
                    <Col sm={3}>
                    <Button color="success" onClick={usernameCheck}>중복</Button>
                    </Col>
                </FormGroup>                
                <FormGroup row>
                    <Label for="name" sm={3}>이름</Label>
                    <Col sm={9}>
                        <Input type="text" name="name" id="name" onChange={changeInput}/>
                    </Col>
                </FormGroup>     
                <FormGroup row>
                    <Label for="password" sm={3}>비밀번호</Label>
                    <Col sm={9}>
                        <Input type="text" name="password" id="password" onChange={changeInput}/>
                    </Col>
                </FormGroup>  
                <FormGroup row>
                    <Label for="email" sm={3}>이메일</Label>
                    <Col sm={9}>
                        <Input type="text" name="email" id="email" onChange={changeInput}/>
                    </Col>
                </FormGroup>  
                <FormGroup row>
                    <Label for="address" sm={3}>주소</Label>
                    <Col sm={9}>
                        <Input type="text" name="address" id="address" onChange={changeInput}/>
                    </Col>
                </FormGroup>  
                <FormGroup row>
                <Button color="primary">회원가입</Button>
                </FormGroup>             
            </Form>    
            <Modal isOpen={modal}>
                <ModalHeader >회원가입</ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>setModal(false)} >확인</Button>
                </ModalFooter>
            </Modal>                         
        </div>
    )
}