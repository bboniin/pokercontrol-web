import React, { useEffect, useState } from 'react';
import {
  MdLock, MdAdd, MdDelete, MdEdit, MdPayments,
} from 'react-icons/md';
import CountUp from 'react-countup';
import { ExclamationCircleFilled } from '@ant-design/icons';

import api from '../../services/api';
import { Container, Cards, Card, Table, Title, ViewInput} from './styles';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Button, Modal, Input, Select, Pagination} from 'antd';
import { getValue } from '../../services/functions';

const { confirm } = Modal;

const Methods = () => {
  const [methods, setMethods] = useState([]);
  const [page, setPage] = useState(0);
  const [methodsTotal, setMethodsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("")
  const [percentage, setPercentage] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [id, setId] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoadingModal, setIsLoadingModal] = useState(false)

  useEffect( () => {
    loadMethods()
}, [page]);

  async function loadMethods() {
    setIsLoading(true);
    await api.get(`/methods?page=${page}`).then((response) => {
      setMethods(response.data.methods)
      setMethodsTotal(response.data.methodsTotal)
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

  async function createAndEditMethod() {
    setIsLoadingModal(true)
    if (!name){
      toast.warning("Preencha o nome do método de pagamento");
    } else {
      if (id) {
        await api.put(`/method/${id}`, {
          name: name,
          percentage: percentage,
          identifier: identifier
        }).then(() => {
          toast.success("Método de pagamento editado com sucesso")
          loadMethods()
          setIsOpen(false)
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
      } else {
        await api.post(`/method`, {
          name: name,
          percentage: percentage,
          identifier: identifier
        }).then(() => {
          toast.success("Método de pagamento criadO com sucesso")
          loadMethods()
          setIsOpen(false)
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
      
   }
   setIsLoadingModal(false)
  }


  async function deleteMethod(user) {
    await api.delete(`/method/${user.id}`).then(response => {
      toast.success("Método de pagamento deletado com sucesso")
      loadMethods()
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
      <h2>Métodos de Pagamento</h2>
      <div>
          <Button type="primary" onClick={() => {
            setId("")
            setName("")
            setPercentage("")
            setIdentifier("")
            setIsOpen(true)
          }}>
          <MdAdd size="20" color="#fff" />
          <span>Novo Método de Pagamento</span>
        </Button>
      </div>

    </Title>


      {!isLoading && (
        <>
          <Cards>
            <Card>
              <div className="icon">
                <MdPayments color="#848484" size={32} />
              </div>
              <div className="number">
                <CountUp duration={1} end={methodsTotal} />
                <p>Total</p>
              </div>
            </Card>
          </Cards>
          {methods.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td>Nome</td>
                    <td>Balanço</td>
                    <td>Porcentagem</td>
                    <td style={{ width: 80 }}>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {
                    methods.map(method => {
                      if (method.id != method.club_id) {
                        return (
                          <tr key={method.id}>
                            <td>{method.name} {method.identifier && ` - (${method.identifier})`}</td>
                            <td>{getValue(method.balance)}</td>
                            <td>{method.percentage.toFixed(2)}%</td>
                            <td style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                              <MdEdit
                                onClick={() => {
                                  setId(method.id)
                                  setName(method.name)
                                  setPercentage(method.percentage || "")
                                  setIdentifier(method.identifier)
                                  setIsOpen(true)
                                }}
                                style={{ cursor: "pointer", marginLeft: 5 }}
                                size={22}
                                color={"#001B22"}
                              />
                              <MdDelete
                                onClick={() => {
                                  confirm({
                                    title: 'Deseja excluir o método de pagamento do clube?',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Após essa ação, o método de pagamento do clube ${method.name} será excluido.`,
                                    onOk() {
                                      deleteMethod(method);
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
                <center style={{marginTop: 15}}>
                  <Pagination simple defaultCurrent={page + 1} onChange={(page) => {
                    setPage(page - 1)
                 }} total={methodsTotal} pageSize={30} 
                 showTotal={(total) => `${total} métodos de pagamento`}/>
                </center>
              </>
              ) : (
                <div className="error">
                  <p>Nenhum método de pagamento encontrado</p>
                </div>
              )}
        </>
      )}

      {isLoading && <Loader />}
      <Modal title={id ? "Editando Método de pagamento" : "Criando Método de pagamento"} width={500} confirmLoading={isLoadingModal} open={isOpen} okText="SALVAR MÉTODO DE PAGAMENTO" cancelText="FECHAR" onOk={() => { 
        createAndEditMethod()
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
            <p>Porcentagem*</p>
            <Input
              placeholder="porcentagem"
              type='number'
              value={percentage}
              onChange={(event) => setPercentage(event.target.value)} />
          </ViewInput>
          <ViewInput>
            <p>Identificador</p>
            <Input
              placeholder="porcentagem"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)} />
          </ViewInput>
        </div>
      </Modal>
    </Container>
  );
};

export default Methods;
