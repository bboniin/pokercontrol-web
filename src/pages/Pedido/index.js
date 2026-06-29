import React, { useEffect, useState } from "react";
import { MdAdd, MdEdit } from "react-icons/md";
import { BiSolidMinusCircle, BiSolidPlusCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import {
  Container,
  Action,
  Table,
  Title,
  ViewInput,
  Amount,
  Payment,
  Payments,
  Center,
} from "./styles";
import Loader from "../../components/Loader";
import { Button, Modal, AutoComplete, Switch } from "antd";
import { toast } from "react-toastify";
import { ExclamationCircleFilled } from "@ant-design/icons";
import MethodsPayment from "../../components/MethodsPayment";

const { confirm } = Modal;

const Pedido = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState("");
  const [nameClient, setNameClient] = useState("");
  const [product, setProduct] = useState("");
  const [methods_transaction, setMethods_transaction] = useState([]);
  const [datePayment, setDatePayment] = useState("");
  const [getMethods, setGetMethods] = useState([]);
  const [nameProduct, setNameProduct] = useState("");
  const [clients, setClients] = useState([]);
  const [clientsC, setClientsC] = useState([]);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsC, setProductsC] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [amount, setAmount] = useState(1);
  const [observation, setObservation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenProduct, setIsOpenProduct] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    loadMethods();
    loadClients();
    loadProducts();
  }, []);

  async function loadMethods() {
    setIsLoading(true);
    await api
      .get("/methods?all=true")
      .then((response) => {
        let methods = response.data;
        methods.map((item) => {
          item.value = item.id;
          item.label = item.name;
        });
        setGetMethods(methods);
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

  async function loadClients() {
    await api.get("/clients?all=true").then((response) => {
      let clientC = response.data.clients;
      clientC.map((item) => {
        item.label = item.name;
        item.value = item.id;
      });
      setClients(clientC);
      setClientsC(clientC);
    });
  }

  async function loadProducts() {
    setIsLoading(true);
    await api.get("/products?all=true").then((response) => {
      let productC = response.data.products;
      productC.map(async (item) => {
        item.label = item.name;
        item.value = item.id;
      });
      setProducts(productC);
      setProductsC(productC);
      if (client) {
        setIsLoading(false);
      } else {
        setIsOpen(true);
      }
    });
  }

  async function createOrder() {
    setIsLoadingModal(true);

    let methods_transactionC = methods_transaction.filter(
      (item) => item.id != "Crédito",
    );

    const value = totalValue();

    if (methods_transactionC.length) {
      if (
        methods_transaction.filter((item) => !item.id || !item.value).length
      ) {
        toast.warn("Selecione o método de pagamento e o valor");
        setIsLoadingModal(false);
        return "";
      }

      if (
        value <
        methods_transaction
          .map((method) => method["value"])
          .reduce((total, value) => total + value)
      ) {
        toast.warn("Valor restante não pode ser negativo");
        setIsLoadingModal(false);
        return "";
      } else {
        if (
          value !=
          methods_transaction
            .map((method) => method["value"])
            .reduce((total, value) => total + value)
        ) {
          methods_transactionC.push({
            id: "Crédito",
            name: "Crédito",
            percentage: 0,
            value:
              value -
              methods_transaction
                .map((method) => method["value"])
                .reduce((total, value) => total + value),
          });
          if (!datePayment) {
            toast.warn("Data de pevisão de pagamento é obrigátorio");
            setIsLoadingModal(false);
            return "";
          }
        }
      }
    } else {
      methods_transactionC.push({
        id: "Crédito",
        name: "Crédito",
        percentage: 0,
        value: value,
      });
      if (!datePayment) {
        toast.warn("Data de pevisão de pagamento é obrigátorio");
        setIsLoadingModal(false);
        return "";
      }
    }

    await api
      .post("/order", {
        methods_transaction: methods_transactionC,
        date_payment: datePayment,
        items: items,
        observation: observation,
        client_id: client.id,
      })
      .then(() => {
        toast.success("Pedido realizado com sucesso");
        navigate(-1);
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
    setIsLoadingModal(false);
  }

  function totalValue() {
    let value = 0;
    items.map((item) => {
      value += item.total * item.value;
    });
    return value;
  }

  return (
    <Center>
      <Container>
        <Title>
          <h2>Novo Pedido</h2>
          <div>
            <Button
              type="primary"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <MdEdit size="20" color="#fff" />
              <span>Alterar Cliente</span>
            </Button>
          </div>
        </Title>
        {!isLoading && (
          <>
            <h3>Dados do Cliente</h3>
            <img
              style={{
                width: 90,
                height: 90,
                marginBottom: 15,
                borderRadius: 2,
              }}
              src={
                client.photo_url ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
              }
            />
            <h4>Nome: {client.name}</h4>
            <h4 style={{ fontWeight: "bold", color: "#1eb019" }}>
              Valor à receber:{" "}
              {client.receive.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </h4>
            <h4 style={{ fontWeight: "bold", color: "#d63211" }}>
              Valor à pagar:{" "}
              {client.debt.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </h4>
            <h4 style={{ fontWeight: "bold" }}>
              Crédito:{" "}
              {client.credit.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </h4>
            <h4
              style={{
                marginBottom: 7,
                fontWeight: "bold",
                color:
                  client.debt == client.receive
                    ? "#000"
                    : client.debt > client.receive
                      ? "#d63211"
                      : "#1eb019",
              }}
            >
              Saldo:{" "}
              {(client.receive - client.debt).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </h4>

            <Action>
              <Button
                type="primary"
                onClick={() => {
                  setProduct("");
                  setNameProduct("");
                  setAmount(1);
                  setIsOpenProduct(true);
                }}
              >
                <MdAdd size="20" color="#fff" />
                <span>Adicionar Produto</span>
              </Button>
            </Action>
            {items.length ? (
              <>
                <Table>
                  <thead>
                    <tr>
                      <td style={{ width: 50 }}></td>
                      <td>Produto</td>
                      <td style={{ textAlign: "center", width: 125 }}>
                        Valor Uni
                      </td>
                      <td style={{ textAlign: "center", width: 125 }}>
                        Valor Total
                      </td>
                      <td style={{ width: 115 }}>Quantidade</td>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((product, index) => (
                      <tr key={product.id}>
                        <td style={{ width: 40 }}>
                          <img
                            style={{ width: 30, height: 30, borderRadius: 2 }}
                            src={
                              product.photo_url ||
                              "https://png.pngtree.com/png-vector/20191126/ourmid/pngtree-trolley-cargo-icon-png-image_2036122.jpg"
                            }
                          />
                        </td>
                        <td>{product.name}</td>
                        <td style={{ textAlign: "center", width: 125 }}>
                          {product.value.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td style={{ textAlign: "center", width: 125 }}>
                          {(product.value * product.total).toLocaleString(
                            "pt-br",
                            { style: "currency", currency: "BRL" },
                          )}
                        </td>
                        <td
                          style={{
                            display: "flex",
                            width: 115,
                            justifyContent: "center",
                          }}
                        >
                          <Amount style={{ width: 115 }}>
                            <p>({product.amount})</p>
                            <button
                              onClick={() => {
                                let itemsC = [...items];
                                if (itemsC[index].total < product.amount) {
                                  itemsC[index].total++;
                                  setItems(itemsC);
                                } else {
                                  toast.warn("Quantidade máxima do produto");
                                }
                              }}
                            >
                              <BiSolidPlusCircle />
                            </button>
                            <span>{product.total}</span>
                            <button
                              onClick={() => {
                                let itemsC = [...items];
                                if (itemsC[index].total > 1) {
                                  itemsC[index].total--;
                                  setItems(itemsC);
                                } else {
                                  confirm({
                                    title:
                                      "Deseja deletar o produto do pedido?",
                                    icon: <ExclamationCircleFilled />,
                                    content: `O produto ${product.name} sairá da comanda`,
                                    onOk() {
                                      setItems(
                                        items.filter((item) => {
                                          return item.id != product.id;
                                        }),
                                      );
                                    },
                                    onCancel() {},
                                  });
                                }
                              }}
                            >
                              <BiSolidMinusCircle />
                            </button>
                          </Amount>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Payment>
                  <h1>
                    Total do Pedido:{" "}
                    {totalValue().toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </h1>
                  <ViewInput style={{ textAlign: "left" }}>
                    <p>Métodos de pagamento</p>
                    <MethodsPayment
                      getMethods={getMethods}
                      operation="entrada"
                      receive={client.receive || 0}
                      methodsPayment={methods_transaction}
                      value={totalValue()}
                      onType={(index, item) => {
                        let methods_transactionC = [...methods_transaction];
                        if (
                          methods_transactionC.filter((data) => {
                            return data.id == item.id;
                          }).length
                        ) {
                          toast.warn("Método de pagamento já selecionado");
                        } else {
                          item.value = methods_transactionC[index].value;
                          methods_transactionC[index] = item;
                          setMethods_transaction(methods_transactionC);
                        }
                      }}
                      onValue={(index, value) => {
                        let methods_transactionC = [...methods_transaction];
                        methods_transactionC[index].value = value;
                        setMethods_transaction(methods_transactionC);
                      }}
                      addMethod={() => {
                        let methods_transactionC = [...methods_transaction];
                        methods_transactionC.push({
                          name: "",
                          value: 0,
                          percentage: 0,
                        });
                        setMethods_transaction(methods_transactionC);
                      }}
                      observation={observation}
                      onObservation={(text) => {
                        setObservation(text);
                      }}
                      datePayment={datePayment}
                      onDate={(date) => {
                        setDatePayment(date);
                      }}
                      removeMethod={(index) => {
                        setMethods_transaction(
                          methods_transaction.filter((data, i) => {
                            return i != index;
                          }),
                        );
                      }}
                    />
                  </ViewInput>
                  <Button
                    type="primary"
                    onClick={() => {
                      createOrder();
                    }}
                  >
                    <span>Finalizar Pedido</span>
                  </Button>
                </Payment>
              </>
            ) : (
              <div className="error">
                <p>Nenhum produto foi adicionado ao pedido</p>
              </div>
            )}
          </>
        )}

        {isLoading && <Loader />}
        <Modal
          title="Selecione o Cliente"
          width={500}
          confirmLoading={isLoadingModal}
          open={isOpen}
          cancelButtonProps={{
            style: {
              display: "none",
            },
          }}
          okButtonProps={{
            style: {
              display: "none",
            },
          }}
          onCancel={() => {
            if (!client) {
              navigate(-1);
            } else {
              setIsOpen(false);
            }
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginBottom: 25,
            }}
          >
            <ViewInput>
              <p>Cliente</p>
              <AutoComplete
                style={{ width: "100%", fontSize: 14, textAlign: "left" }}
                options={clients}
                value={client ? client.name : nameClient}
                notFoundContent={<>Nenhum cliente encontrado</>}
                onSelect={(text, client) => {
                  setClient(client);
                  setIsOpen(false);
                  setIsLoading(false);
                }}
                onSearch={(text) => {
                  if (client) {
                    if (text.toUpperCase() != client.name.toUpperCase()) {
                      setClient("");
                    }
                  }

                  setNameClient(text);
                  setClients(
                    clientsC.filter((item) => {
                      return (
                        String(item.name)
                          .toUpperCase()
                          .indexOf(text.toUpperCase()) != -1
                      );
                    }),
                  );
                }}
                placeholder="procurar por nome"
              />
            </ViewInput>
          </div>
        </Modal>
        <Modal
          title="Adicionar Produto"
          width={500}
          confirmLoading={isLoadingModal}
          open={isOpenProduct}
          cancelButtonProps={{
            style: {
              display: "none",
            },
          }}
          okText="CONFIRMAR"
          onOk={async () => {
            if (product && amount) {
              let itemsC = items;
              if (
                items.filter((item) => {
                  return item.id == product.id;
                }).length == 1
              ) {
                toast.warn("Produto já adicionado ao pedido");
              } else {
                await api
                  .get(`/product/${product.id}`)
                  .then((response) => {
                    let item = { ...response.data, total: amount };
                    setItems([...items, item]);
                    setIsOpenProduct(false);
                  })
                  .catch((error) => {
                    toast.error("Ocorreu um erro ao buscar produto");
                  });
              }
            }
          }}
          onCancel={() => {
            setIsOpenProduct(false);
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginBottom: 25,
            }}
          >
            <ViewInput>
              <p>Produto</p>
              <AutoComplete
                style={{ width: "100%", fontSize: 14, textAlign: "left" }}
                options={products.filter((item) => {
                  return item.amount > 1;
                })}
                value={product ? product.name : nameProduct}
                notFoundContent={<>Nenhum producte encontrado</>}
                onSelect={(text, product) => {
                  setProduct(product);
                  setIsOpen(false);
                  setIsLoading(false);
                }}
                onSearch={(text) => {
                  if (product) {
                    if (text.toUpperCase() != product.name.toUpperCase()) {
                      setProduct("");
                    }
                  }
                  setNameProduct(text);
                  setProducts(
                    productsC.filter((item) => {
                      return (
                        String(item.name)
                          .toUpperCase()
                          .indexOf(text.toUpperCase()) != -1
                      );
                    }),
                  );
                }}
                placeholder="procurar por nome"
              />
            </ViewInput>
            {product && (
              <ViewInput>
                <p>Quantidade</p>
                <Amount style={{ width: 115 }}>
                  <p>({product.amount})</p>
                  <button
                    onClick={() => {
                      if (amount < product.amount) {
                        setAmount(amount + 1);
                      } else {
                        toast.warn("Quantidade máxima do produto");
                      }
                    }}
                  >
                    <BiSolidPlusCircle />
                  </button>
                  <span>{amount}</span>
                  <button
                    onClick={() => {
                      if (amount > 1) {
                        setAmount(amount - 1);
                      }
                    }}
                  >
                    <BiSolidMinusCircle />
                  </button>
                </Amount>
              </ViewInput>
            )}
          </div>
        </Modal>
      </Container>
    </Center>
  );
};

export default Pedido;
