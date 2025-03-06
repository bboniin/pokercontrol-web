import React, { useEffect, useState } from 'react';
import {
  MdLock, MdAdd, MdDelete, MdEdit,
} from 'react-icons/md';
import CountUp from 'react-countup';
import { ExclamationCircleFilled } from '@ant-design/icons';

import api from '../../services/api';
import { Container, Cards, Card, Table, Title, ViewInput} from './styles';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Button, Modal, Input, Select} from 'antd';

const { confirm } = Modal;

const Acessos = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [id, setId] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isLoadingModal, setIsLoadingModal] = useState(false)

  useEffect( () => {
    loadUsers()
}, []);

  async function loadUsers() {
    setIsLoading(true);
    await api.get("/users").then((response) => {
      setUsers(response.data)
    }).catch(({ response }) => {
      if (response) {
        if (response.data) {
          if (response.data.message) {
            toast.warn(response.data.message)
          } else {
            toast.error("Erro Interno. verifique sua conexão e tente novamente")
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente")
        }
      } else {
        toast.error("Erro Interno. verifique sua conexão e tente novamente")
      }
    })
   setIsLoading(false);
  }

  async function createUser() {
    setIsLoadingModal(true)
    if (!type || !email || !name || !password){
       toast.warning("Preencha os campos obrigatórios");
    }else{
      await api.post(`/user`, {
        name: name,
        email: email,
        type: type,
        password: password
      }).then((response) => {
        toast.success("Usuário do clube criado com sucesso")
        setIsOpen(false)
        loadUsers()
      }).catch(({ response }) => {
        if (response) {
          if (response.data) {
            if (response.data.message) {
              toast.warn(response.data.message)
            } else {
              toast.error("Erro Interno. verifique sua conexão e tente novamente")
            }
          } else {
            toast.error("Erro Interno. verifique sua conexão e tente novamente")
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente")
        }
      })
    }
    setIsLoadingModal(false)
  }

  async function editUser() {
    setIsLoadingModal(true)
    if (!type || !email || !name){
      toast.warning("Preencha os campos obrigatórios");
   }else{
     await api.put(`/user/${id}`, {
       name: name,
       email: email,
       type: type,
       password: password
     }).then((response) => {
       toast.success("Usuário do clube editado com sucesso")
       setIsOpenEdit(false)
       loadUsers()
     }).catch(({ response }) => {
       if (response) {
         if (response.data) {
           if (response.data.message) {
             toast.warn(response.data.message)
           } else {
             toast.error("Erro Interno. verifique sua conexão e tente novamente")
           }
         } else {
           toast.error("Erro Interno. verifique sua conexão e tente novamente")
         }
       } else {
         toast.error("Erro Interno. verifique sua conexão e tente novamente")
       }
     })
   }
   setIsLoadingModal(false)
  }

  async function deleteuser(user) {
    await api.delete(`/user/${user.id}`).then(response => {
      toast.success("Usuário do clube deletado com sucesso")
      loadUsers()
    }).catch(({ response }) => {
      if (response) {
        if (response.data) {
          if (response.data.message) {
            toast.warn(response.data.message)
          } else {
            toast.error("Erro Interno. verifique sua conexão e tente novamente")
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente")
        }
      } else {
        toast.error("Erro Interno. verifique sua conexão e tente novamente")
      }
    })
  }

  return (
    <Container>
    <Title>
      <h2>Usuários do Clube</h2>
      <div>
          <Button type="primary" onClick={() => {
            setId("")
            setName("")
            setEmail("")
            setPassword("")
            setType("")
            setIsOpen(true)
          }}>
          <MdAdd size="20" color="#fff" />
          <span>Novo Usuário</span>
        </Button>
      </div>

    </Title>


      {!isLoading && (
        <>
      <Cards>
        <Card>
          <div className="icon">
            <MdLock color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={users.length - 1} />
            <p>Total</p>
          </div>
        </Card>
      </Cards>
          {users.length - 1 ? (
          <Table>
            <thead>
              <tr>
                <td>Nome</td>
                <td>Tipo de Acesso</td>
                <td>Email</td>
                <td style={{ width: 80 }}>
                </td>
              </tr>
            </thead>
            <tbody>
                {
                  users.map(user => {
                    if (user.id != user.club_id) {
                      return (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td style={{ textTransform: "capitalize" }}>{user.type} {user.id == user.club_id && " Master"}</td>
                          <td>{user.email}</td>
                          <td style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                            <MdEdit
                              onClick={() => {
                                setId(user.id)
                                setName(user.name)
                                setType(user.type)
                                setEmail(user.email)
                                setPassword("")
                                setIsOpenEdit(true)
                              }}
                              style={{ cursor: "pointer", marginLeft: 5 }}
                              size={22}
                              color={"#001B22"}
                            />
                            <MdDelete
                              onClick={() => {
                                confirm({
                                  title: 'Deseja excluir o usuário do clube?',
                                  icon: <ExclamationCircleFilled />,
                                  content: `Após essa ação, o usuário do clube ${user.name} será excluido.`,
                                  onOk() {
                                    deleteuser(user);
                                  },
                                  onCancel() { },
                                });
                              }}
                              style={{ cursor: "pointer", marginLeft: 5 }}
                              size={22}
                              color={"#001B22"}
                            />
                          </td>
                        </tr>
                      )
                    }
                  })
              }
              </tbody>
            </Table>
              )
              : (
                <div className="error">
                  <p>Nenhum usuário do clube encontrado</p>
                </div>
              )}
        </>
      )}

      {isLoading && <Loader />}
      <Modal title="Novo usuário do clube" width={500} confirmLoading={isLoadingModal} open={isOpen} okText="CADASTRAR USUÁRIO" cancelText="FECHAR" onOk={() => { 
          createUser()
      }} onCancel={() => {
        setIsOpen(false)
      }}>
        <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 25}}>
          <ViewInput>
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)} />
          </ViewInput>
          <ViewInput>
            <p>Email*</p>
            <Input
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)} />
          </ViewInput>
          <ViewInput>
            <p>Senha*</p>
            <Input
              placeholder="senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)} />
          </ViewInput>
          <ViewInput>
            <p>Tipo de Acesso*</p>
            <Select
                    placeholder={"tipo de acesso"}
                    value={type || null}
                    style={{width: "100%", fontSize: 14, textAlign: "left"}}
                    onChange={(text, type) => {
                      setType(type.value)
                    }}
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Caixa", value: "caixa" },
                      { label: "Bar", value: "bar"}
                    ]}
                />
          </ViewInput>
        </div>
      </Modal>
      <Modal title="Editar usuário do clube" width={500} confirmLoading={isLoadingModal} open={isOpenEdit} okText="EDITAR USUÁRIO" cancelText="FECHAR" onOk={() => { 
          editUser()
      }} onCancel={() => {
        setIsOpenEdit(false)
      }}>
        <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 25}}>
          <ViewInput>
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)} />
          </ViewInput>
          <ViewInput>
            <p>Email*</p>
            <Input
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)} />
          </ViewInput>
          <ViewInput>
            <p>Nova Senha*</p>
            <Input
              placeholder="nova senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)} />
          </ViewInput>
          <ViewInput>
            <p>Tipo de Acesso*</p>
            <Select
                    placeholder={"tipo de acesso"}
                    value={type || null}
                    style={{width: "100%", fontSize: 14, textAlign: "left"}}
                    onChange={(text, type) => {
                      setType(type.value)
                    }}
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Caixa", value: "caixa" },
                      { label: "Bar", value: "bar"}
                    ]}
                />
          </ViewInput>
        </div>
      </Modal>
    </Container>
  );
};

export default Acessos;
