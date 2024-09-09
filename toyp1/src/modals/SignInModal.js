import {useState, React} from 'react';
import {Button, Modal, Form, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';





export default function SignInModal({checkAuth, setCheckAuth, show, onHide}) {
  
  

  const [formData, setFormData] = useState({
    email : '',
    password : '',
  });
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit exec');
    try {
      const response = await fetch('/loginCheck', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(formData)
      });

      if(response.ok) {
        const result = await response.json();
        if(result.loginSuccess === false){
          alert(result.message);
        }
        else {

          console.log(result.loginSuccess, result.userId);
          navigate('/');
          onHide();
          setCheckAuth(!checkAuth);
            
        }
      }
      
    }
    catch (error) {
      console.error('Error : ', error);
    }
  }



    return (
        <Modal
            show = {show}
            onHide = {onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
        <Container>

          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Sign In
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
          <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3" >
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name = "email"
              value = {formData.email}
              onChange = {handleChange}
              placeholder="Enter email"
              required />
          </Form.Group>
          

          <Form.Group className="mb-3" >
            <Form.Label>Password</Form.Label>
            <Form.Control 
            type="password" 
            name = "password"
            value ={formData.password}
            onChange = {handleChange}
            placeholder="Password" 
            required />
          </Form.Group>

          
          <Button variant="primary" type="submit">
            LogIn
          </Button>
          
        </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              onHide();
              navigate('/');
            }}>Close</Button>
          </Modal.Footer>
        </Container>
    </Modal>
    );
} 