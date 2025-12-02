import { Input, Button, Label, FormGroup, Form, Col, Row } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { myAxios } from '../config';
import { userAtom } from '../atoms';
import { useAtomValue, useAtom } from 'jotai/react';

export default function NoticeWrite() {
    const [imgFile, setImgFile] = useState(null);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const user = useAtomValue(userAtom);

    const fileRef = useRef(null);
    const imgRef = useRef(null);
    const navigate = useNavigate();

    const divStyle = {
        margin: '0 auto',
        width: '600px',
        border: '1px solid lightgray',
        borderRadius: '7px',
        padding: '10px'
    }

    const changeImgFile = (e) => {
        setImgFile(e.target.files[0]);
        imgRef.current.src = URL.createObjectURL(e.target.files[0])
    }

    const submit = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("writerId", user.id);
        formData.append("ifile", imgFile);
        formData.append("dfile", file);

        myAxios().post(`/noticeWrite`, formData)
            .then(res => {
                console.log(res)
                let noticeNum = res.data;
                navigate(`/noticeDetail/${noticeNum}`)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            <div className='header-text'>공지사항 등록</div>
            <br />
            <div style={divStyle}>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <FormGroup row>
                        <Label for='title' sm={2}>제목</Label>
                        <Col><Input id='title' type="text" name="title" onChange={(e) => setTitle(e.target.value)} /></Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label
                            for="categorySelect"
                            sm={2}
                        >
                            카테고리
                        </Label>
                        <Col sm={10}>
                            <Input
                                id="categorySelect"
                                name="category"
                                type="select"
                            >
                                <option>
                                    일반
                                </option>
                                <option>
                                    배송
                                </option>
                                <option>
                                    교환/반품
                                </option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for='content' sm={2}>내용</Label>
                        <Col sm={10}><Input id='content' type="textarea" name="content"
                            cols="40" onChange={(e) => setContent(e.target.value)} />
                        </Col>
                        </FormGroup>
                   <FormGroup row>
                    <Label for='imageFile' sm={2}>이미지</Label>
                        <Col>
                            <Input id='imageFile' name='imageFile' type="file" accept='image/*' innerRef={fileRef}
                                onChange={changeImgFile} />
                            {/* <img src="/plus.png" width="100px" alt="" ref={imgRef}
                                    onClick={()=>fileRef.current?.click()}/> */}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for='file' sm={2}>파일</Label>
                        <Col>
                            <Input id='file' name='file' type="file" onChange={(e) => setFile(e.target.files[0])} />
                        </Col>
                    </FormGroup>
                    <Row>
                        
                        <Col className='text-start' >
                            <Button type='reset' color="dark" outline onClick={() => imgRef.current.src = "/plus.png"} >다시쓰기</Button>
                            </Col>
                        <Col className='text-end'>
                            <Button color='warning' onClick={submit}>등록</Button>&nbsp;&nbsp;
                        </Col>
                    </Row>

                </Form>
            </div>
        </>
    )
}