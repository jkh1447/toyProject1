import {useState, React} from 'react';
import {Button, Modal, Form, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';





export default function SignUpModal({show, onHide}) {
  
  

  const [formData, setFormData] = useState({
    name : '',
    email : '',
    password : '',
    confirmPassword : '',
    role : 0,
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

    if(formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/register', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(formData)
      });

      if(response.ok) {
        const result = await response.json();
        console.log('Success', result);
        navigate('/');
        onHide();
      }else {
        console.error('Error : ', response.statusText);
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
              Sign Up
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
          <Form onSubmit={handleSubmit}>
            
          <Form.Group className="mb-3" >
            <Form.Label>Nick Name</Form.Label>
            <Form.Control  
              type = "text"
              name = "name"
              value = {formData.name}
              onChange = {handleChange}
              required
              placeholder="Enter Nick Name" />
          </Form.Group>

          <Form.Group className="mb-3" >
            <Form.Label>Email address</Form.Label>
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

          <Form.Group className="mb-3" >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
            type="password" 
            name = "confirmPassword"
            value ={formData.confirmPassword}
            onChange = {handleChange}
            placeholder="Confirm Password"
            required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
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