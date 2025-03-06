import React, { useEffect, useState } from 'react';
import {
 MdAdd, MdAllInclusive, MdClose, MdStore, MdVisibility,
} from 'react-icons/md';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import api from '../../services/api';
import { Container, Cards, Card, Table, Title} from './styles';
import Loader from '../../components/Loader';
import { Button, Modal, Pagination } from 'antd';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const { confirm } = Modal;

const Bar = () => {
  const navigate = useNavigate();
  const [commands, setCommands] = useState([]);
  const [page, setPage] = useState(0);
  const [commandsTotal, setCommandsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommands()
  }, [page]);

  
  async function loadCommands() {
    await api.get(`/commands?page=${page}`).then((response) => {
      let commands = response.data.commands
      commands.map((data) => {
        data.value = 0
        data.orders.map((item) => {
          data.value += item.value
        })
      })
      setCommands(commands)
      setCommandsTotal(response.data.commandsTotal)
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

  async function closedCommand(id) {
    await api.put(`command/${id}`).then((response) => {
      loadCommands()
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
      <h2>Bar</h2>
      <div>
          <Button type="primary" onClick={() => {
            navigate("/pedidos")
          }}>
          <MdAllInclusive size="20" color="#fff" />
          <span>Todos Pedido</span>
        </Button>
          <Button type="primary" onClick={() => {
            navigate("/bar/pedido")
          }}>
          <MdAdd size="20" color="#fff" />
          <span>Novo Pedido</span>
        </Button>
      </div>

    </Title>

      <Cards>
        <Card>
          <div className="icon">
            <MdStore color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={commandsTotal} />
            <p>Total</p>
          </div>
        </Card>
        <Card>
          <div className="icon">
            <MdStore color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={commands.filter((item)=>{ return item.open}).length} />
            <p>Comandas abertas</p>
          </div>
        </Card>
      </Cards>

      {!isLoading && (
        <>
          {commands.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td style={{ width: 50 }}>
                    </td>
                    <td>Cliente</td>
                    <td style={{textAlign: "center"}}>Aberta em</td>
                    <td style={{textAlign: "center"}}>Valor Total</td>
                    <td style={{ width: 40 }}>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {
                    commands.map(order => (
                      <tr key={order.id}>
                        <td style={{ width: 40 }}>
                          <img style={{ width: 30, height: 30, borderRadius: 2 }} src={order.client.photo_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"} />
                        </td>
                        <td>{order.client.name}</td>
                        <td style={{ textAlign: "center" }}>{format(new Date(order.create_at), "dd/MM/yyyy HH:mm")}</td>
                        <td style={{textAlign: "center"}}>{order.value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                        <td style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                          <MdVisibility
                            onClick={() => {
                              navigate(`/bar/comanda/${order.id}`)
                            }}
                              style={{ cursor: "pointer", marginLeft: 5 }}
                              size={22}
                              color={"#001B22"}
                          />
                          { order.open && (
                          <MdClose
                            onClick={() => {
                              confirm({
                                title: 'Deseja fechar essa comanda?',
                                icon: <ExclamationCircleFilled/>,
                                content: `Após essa ação, está comanda será fechada.`,
                                onOk() {
                                  closedCommand(order.id);
                                },
                                onCancel() {},
                                cancelText: "Cancelar",
                              });
                            }}
                              style={{ cursor: "pointer", marginLeft: 5 }}
                              size={22}
                              color={"#001B22"}
                            />)}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              <center style={{marginTop: 15}}>
                <Pagination simple defaultCurrent={page + 1} onChange={(page) => {
                  setPage(page - 1)
              }} total={commandsTotal} pageSize={30} 
              showTotal={(total) => `${total} pedidos`}/>
              </center>
            </>
            ) : (
              <div className="error">
                <p>Nenhuma comanda aberta</p>
              </div>
            )}
        </>
      )}

      {isLoading && <Loader />}
    </Container>
  );
};

export default Bar;
