import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMail, MdPassword } from 'react-icons/md';

import { toast } from 'react-toastify';
import { Container, Content } from './styles';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/AuthContext';
import { Button } from 'antd';
import Input from '../../components/Input';

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  async function login() {
    setLoading(true)
    await signIn({ email, password }).then((ok) => {
      if (ok) {
        navigate("/")
      }
    })
    setLoading(false)
  }

  return (
    <Container>
      <Content>
                <div className='logo'>
                  <img src={logo} alt="logo" />
                </div>
                <div className='input' style={{marginBottom: 0}}>
                <Input
                    white={true}
                    styleInput={{background: "#fff", paddingLeft: 10}}
                    type="email"
                    title={"Digite seu email"}
                    placeholder="email"
                    icon={<MdMail style={{ marginRight: 10 }} />}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            login()
                        }
                    }}
                    onChange={(text) => {
                      setEmail(text.target.value)
                    }}
                    value={email}
                  />
                </div>  
                <div className='input'>
                <Input
                    white={true}
                    type="password"
                    title={"Digite sua senha"}
                    placeholder="senha"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            login()
                        }
                    }}
                    icon={<MdPassword style={{ marginRight: 10 }} />}
                    onChange={(text)=>{setPassword(text.target.value)}}
                    value={password}
                  />
                </div>  
                <Button type="loading" loading={loading} onClick={() => {
                  login()
                }} style={{width: "calc(100% - 10px)", background: "#fff", color: "#001B22", borderRadius: 5}}>Entrar</Button>
      </Content>
    </Container>
  );
};

export default Login;
