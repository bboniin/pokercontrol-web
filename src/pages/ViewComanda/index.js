import React, { useEffect, useState, useRef } from "react";
import { MdPrint } from "react-icons/md";
import { useParams } from "react-router-dom";

import api from "../../services/api";
import { Container, Table, Title, Payment, TablePrint } from "./styles";
import Loader from "../../components/Loader";
import { Button, Modal } from "antd";
import logoPablo from "../../assets/logoPablo.png";
import logo from "../../assets/logo.png";

import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/AuthContext";

const ViewComanda = () => {
  const { user } = useAuth();
  const { id } = useParams();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [command, setCommand] = useState({
    value: 0,
  });
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommand();
  }, []);

  async function loadCommand() {
    await api
      .get(`/command/${id}`)
      .then((response) => {
        let command = response.data;
        command.value = 0;
        command.products_order.map((data) => {
          command.value += data.value * data.amount;
        });
        setCommand(command);
        setIsLoading(false);
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data) {
            if (response.data.message) {
              toast.warn(response.data.message);
            } else {
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente",
              );
            }
          } else {
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
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
        <h2>Comanda</h2>
      </Title>
      {!isLoading && (
        <>
          <h3>Dados do Cliente</h3>
          <img
            style={{
              width: 90,
              height: 90,
              marginBottom: 15,
              bcommandRadius: 2,
            }}
            src={
              command.client.photo_url ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
            }
          />
          <h4>Nome: {command.client.name}</h4>
          <h4 style={{ fontWeight: "bold", color: "#1eb019" }}>
            Valor à receber:{" "}
            {command.client.receive.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h4>
          <h4 style={{ fontWeight: "bold", color: "#d63211" }}>
            Valor à pagar:{" "}
            {command.client.debt.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h4>
          <h4 style={{ fontWeight: "bold" }}>
            Crédito:{" "}
            {command.client.credit.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h4>
          <h4
            style={{
              marginBottom: 7,
              fontWeight: "bold",
              color:
                command.client.debt == command.client.receive
                  ? "#000"
                  : command.client.debt > command.client.receive
                    ? "#d63211"
                    : "#1eb019",
            }}
          >
            Saldo:{" "}
            {(command.client.receive - command.client.debt).toLocaleString(
              "pt-br",
              { style: "currency", currency: "BRL" },
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
              {command.products_order.map((product) => (
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
              Total da Comanda:{" "}
              {command.value.toLocaleString("pt-br", {
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
              <span>Imprimir Comanda</span>
            </Button>
          </Payment>
          <Modal
            title="Imprimir Comanda"
            width={300}
            open={isOpen}
            cancelButtonProps={{
              style: {
                display: "none",
              },
            }}
            okText="IMPRIMIR"
            onOk={handlePrint}
            maskClosable={false}
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
                fontWeight: "bold",
                padding: "20px 15px",
              }}
            >
              {user.name == "pablospoker" && (
                <img
                  src={logoPablo}
                  alt=""
                  style={{ width: 180, marginBottom: 10 }}
                />
              )}

              {user.name != "pablospoker" && (
                <img
                  src={logo}
                  alt=""
                  style={{
                    width: 220,
                    position: "absolute",
                    top: "15%",
                    opacity: 0.28,
                  }}
                />
              )}
              <p style={{ width: "100%" }}>Cliente: {command.client.name}</p>
              <p style={{ width: "100%", lineHeight: 2 }}>
                Comanda Iniciada em:{" "}
                {format(new Date(command.create_at), "dd/MM/yyyy hh:MM")}
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
                  {command.products_order.map((product) => (
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
                          { style: "currency", currency: "BRL" },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TablePrint>
              <h3
                style={{ width: "100%", marginTop: 10, fontWeight: "bolder" }}
              >
                Total:{" "}
                {command.value.toLocaleString("pt-br", {
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

export default ViewComanda;
