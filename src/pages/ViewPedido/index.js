import React, { useEffect, useState, useRef } from "react";
import { MdPrint } from "react-icons/md";
import { useParams } from "react-router-dom";

import api from "../../services/api";
import { Container, Table, Title, Payment, TablePrint } from "./styles";
import Loader from "../../components/Loader";
import { Button, Modal } from "antd";
import logo from "../../assets/logo.png";

import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Pedido = () => {
  const { id } = useParams();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [order, setOrder] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    await api
      .get(`/order/${id}`)
      .then((response) => {
        setOrder(response.data);
        setIsLoading(false);
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data) {
            if (response.data.message) {
              toast.warn(response.data.message);
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente"
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente"
            );
          }
        } else {
          toast.error("Erro Interno. verifique sua conexão e tente novamente");
        }
      });
  }

  return (
    <Container>
      <Title>
        <h2>Pedido</h2>
      </Title>
      {!isLoading && (
        <>
          <h3>Dados do Cliente</h3>
          <img
            style={{ width: 90, height: 90, marginBottom: 15, borderRadius: 2 }}
            src={
              order.client.photo_url ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
            }
          />
          <h4>Nome: {order.client.name}</h4>
          <h4 style={{ fontWeight: "bold", color: "#1eb019" }}>
            Valor à receber:{" "}
            {order.client.receive.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h4>
          <h4 style={{ fontWeight: "bold", color: "#d63211" }}>
            Valor à pagar:{" "}
            {order.client.debt.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h4>
          <h4 style={{ fontWeight: "bold" }}>
            Crédito:{" "}
            {order.client.credit.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h4>
          <h4
            style={{
              marginBottom: 7,
              fontWeight: "bold",
              color:
                order.client.debt == order.client.receive
                  ? "#000"
                  : order.client.debt > order.client.receive
                  ? "#d63211"
                  : "#1eb019",
            }}
          >
            Saldo:{" "}
            {(order.client.receive - order.client.debt).toLocaleString(
              "pt-br",
              { style: "currency", currency: "BRL" }
            )}
          </h4>

          <Table>
            <thead>
              <tr>
                <td>Produto</td>
                <td style={{ textAlign: "center", width: 125 }}>Valor Uni</td>
                <td style={{ textAlign: "center", width: 125 }}>Valor Total</td>
              </tr>
            </thead>
            <tbody>
              {order.products_order.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.amount}x {product.name}
                  </td>
                  <td style={{ textAlign: "center", width: 125 }}>
                    {product.value.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td style={{ textAlign: "center", width: 125 }}>
                    {(product.value * product.amount).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Payment>
            <h1>
              Total do Pedido:{" "}
              {order.value.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </h1>
            <Button
              type="primary"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <MdPrint size="20" color="#fff" />
              <span>Imprimir Pedido</span>
            </Button>
          </Payment>
          <Modal
            title="Imprimir pedido"
            width={300}
            open={isOpen}
            cancelButtonProps={{
              style: {
                display: "none",
              },
            }}
            okText="IMPRIMIR"
            onOk={handlePrint}
            onCancel={() => {
              setIsOpen(false);
            }}
          >
            <div
              ref={componentRef}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "center",
                marginBottom: 25,
                padding: "20px 15px",
              }}
            >
              <img src={logo} alt="" style={{ width: 150, marginBottom: 25 }} />
              <p style={{ width: "100%" }}>Cliente: {order.client.name}</p>
              <p style={{ width: "100%", lineHeight: 2 }}>
                Data do Pedido:{" "}
                {format(new Date(order.create_at), "dd/MM/yyyy hh:MM")}
              </p>
              <TablePrint>
                <thead>
                  <tr>
                    <td>Produto</td>
                    <td style={{ textAlign: "center", width: 125 }}>
                      Valor Uni
                    </td>
                    <td style={{ textAlign: "center", width: 115 }}>Total</td>
                  </tr>
                </thead>
                <tbody>
                  {order.products_order.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.amount}x {product.name}
                      </td>
                      <td style={{ textAlign: "center", width: 125 }}>
                        {product.value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td style={{ textAlign: "center", width: 125 }}>
                        {(product.value * product.amount).toLocaleString(
                          "pt-br",
                          { style: "currency", currency: "BRL" }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TablePrint>
              <h3 style={{ width: "100%", marginTop: 10 }}>
                Total:{" "}
                {order.value.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </div>
          </Modal>
        </>
      )}

      {isLoading && <Loader />}
    </Container>
  );
};

export default Pedido;
