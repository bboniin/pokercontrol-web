import React, { useEffect, useState } from 'react';
import {
 MdAdd, MdStore, MdVisibility,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import api from '../../services/api';
import { Container, Cards, Card, Table, Title} from './styles';
import Loader from '../../components/Loader';
import { Button, Pagination } from 'antd';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const Pedidos = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadorders()
  }, [page]);

  
  async function loadorders() {
    await api.get(`/orders?page=${page}`).then((response) => {
      setOrders(response.data.orders)
      setOrdersTotal(response.data.ordersTotal)
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

  return (
    <Container>
    <Title>
      <h2>Pedidos</h2>
    </Title>

      <Cards>
        <Card>
          <div className="icon">
            <MdStore color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={ordersTotal} />
            <p>Pedidos</p>
          </div>
        </Card>
      </Cards>

      {!isLoading && (
        <>
          {orders.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td style={{ width: 50 }}>
                    </td>
                    <td>Cliente</td>
                    <td style={{textAlign: "center"}}>Data</td>
                    <td style={{textAlign: "center"}}>Valor Total</td>
                    <td style={{ width: 40 }}>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {
                    orders.map(order => (
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
                              navigate(`/bar/pedido/${order.id}`)
                            }}
                              style={{ cursor: "pointer", marginLeft: 5 }}
                              size={22}
                              color={"#001B22"}
                            />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              <center style={{marginTop: 15}}>
                <Pagination simple defaultCurrent={page + 1} onChange={(page) => {
                  setPage(page - 1)
              }} total={ordersTotal} pageSize={30} 
              showTotal={(total) => `${total} pedidos`}/>
              </center>
            </>
            ) : (
              <div className="error">
                <p>Nenhum pedido encontrado</p>
              </div>
            )}
        </>
      )}

      {isLoading && <Loader />}
    </Container>
  );
};

export default Pedidos;
