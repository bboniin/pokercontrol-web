import React, { useEffect, useState } from "react";
import {
  MdAccountCircle,
  MdAdd,
  MdAddPhotoAlternate,
  MdDelete,
  MdEdit,
  MdVisibility,
} from "react-icons/md";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { ExclamationCircleFilled } from "@ant-design/icons";

import api from "../../services/api";
import {
  Container,
  Cards,
  Card,
  Table,
  Title,
  ViewInput,
  InputTel,
} from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Button, Modal, Input, Pagination } from "antd";
import IntlCurrencyInput from "react-intl-currency-input";
import { useAuth } from "../../hooks/AuthContext";

const { Search } = Input;
const { confirm } = Modal;

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const { update } = useAuth();
  const [clientsTotal, setClientsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [credit, setCredit] = useState(0);
  const [page, setPage] = useState(0);
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchNameLast, setSearchNameLast] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  useEffect(() => {
    loadClients();
  }, [page]);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    await api
      .get("/user")
      .then((response) => {
        update({ user: response.data });
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
    setIsLoading(true);
    await api
      .get(`/clients?page=${page}&search=${searchName}`)
      .then((response) => {
        setClients(response.data.clients);
        setClientsTotal(response.data.clientsTotal);
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
    setIsLoading(false);
  }

  async function createClient() {
    setIsLoadingModal(true);
    if (!name) {
      toast.warning("Nome é obrigatório");
    } else {
      if (phone_number) {
        if (phone_number.length != 11) {
          toast.warn("Telefone inválido");
          setIsLoadingModal(false);
          return "";
        }
      }

      if (cpf) {
        if (cpf.length != 11) {
          toast.warn("CPF inválido");
          setIsLoadingModal(false);
          return "";
        }
      }

      const data = new FormData();
      data.append("name", name);
      data.append("address", address);
      data.append("cpf", cpf);
      data.append("credit", credit);
      data.append("observation", "");
      data.append("phone_number", phone_number);
      if (photo.name) {
        data.append("file", photo, photo.name);
      }
      await api
        .post(`/client`, data)
        .then((response) => {
          toast.success("Cliente criado com sucesso");
          setIsOpen(false);
          loadClients();
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
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
            );
          }
        });
    }
    setIsLoadingModal(false);
  }

  async function editClient() {
    setIsLoadingModal(true);
    if (!name) {
      toast.warning("Nome é obrigatório");
    } else {
      if (phone_number) {
        if (phone_number.length != 11) {
          toast.warn("Telefone inválido");
          setIsLoadingModal(false);
          return "";
        }
      }

      if (cpf) {
        if (cpf.length != 11) {
          toast.warn("CPF inválido");
          setIsLoadingModal(false);
          return "";
        }
      }
      const data = new FormData();
      data.append("name", name);
      data.append("address", address);
      data.append("cpf", cpf);
      data.append("credit", credit);
      data.append("observation", "");
      data.append("phone_number", phone_number);
      if (photo.name) {
        data.append("file", photo, photo.name);
      }
      await api
        .put(`/client/${id}`, data)
        .then((response) => {
          toast.success("Cliente editado com sucesso");
          setIsOpenEdit(false);
          loadClients();
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
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente",
            );
          }
        });
    }
    setIsLoadingModal(false);
  }

  async function deleteClient(client) {
    await api
      .delete(`/client/${client.id}`)
      .then((response) => {
        toast.success("Cliente deletado com sucesso");
        loadClients();
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
        <h2>Clientes</h2>
        <div>
          <Button
            type="primary"
            onClick={() => {
              setId("");
              setName("");
              setPhone_number("");
              setAddress("");
              setCredit(50000);
              setPhoto("");
              setCpf("");
              setIsOpen(true);
            }}
          >
            <MdAdd size="20" color="#fff" />
            <span>Novo Cliente</span>
          </Button>
        </div>
      </Title>
      <Cards>
        <Card>
          <div className="icon">
            <MdAccountCircle color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={clientsTotal} />
            <p>Total</p>
          </div>
        </Card>
      </Cards>
      <Search
        placeholder="procurar por nome, telefone ou cpf"
        enterButton="Procurar"
        style={{ maxWidth: 500, marginTop: 30 }}
        size="middle"
        onInput={(text) => {
          setSearchName(text.target.value);
        }}
        onSearch={() => {
          createClientes();
        }}
        value={searchName}
        loading={isLoading}
      />
      {!isLoading && (
        <>
          {clients.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td style={{ width: 50 }}></td>
                    <td>Nome</td>
                    <td>Telefone</td>
                    <td>Crédito</td>
                    <td>À receber</td>
                    <td>À pagar</td>
                    <td style={{ width: 80 }}></td>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td style={{ width: 40 }}>
                        <img
                          style={{ width: 30, height: 30, borderRadius: 2 }}
                          src={
                            client.photo_url ||
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
                          }
                        />
                      </td>
                      <td>{client.name}</td>
                      <td>
                        {client.phone_number
                          ? client.phone_number.replace(
                              /(\d{2})(\d{5})(\d{4})/,
                              "($1) $2-$3",
                            )
                          : "Não cadastrado"}
                      </td>
                      <td>
                        {client.credit.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {client.receive.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {client.debt.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Link
                          style={{ height: 22 }}
                          to={`/client/${client.id}`}
                        >
                          <MdVisibility
                            style={{ cursor: "pointer", marginLeft: 5 }}
                            size={22}
                            color={"#001B22"}
                          />
                        </Link>
                        <MdEdit
                          onClick={() => {
                            setId(client.id);
                            setName(client.name);
                            setPhone_number(client.phone_number);
                            setCpf(client.cpf);
                            setAddress(client.address);
                            setCredit(client.credit);
                            setPhoto({ photo_url: client.photo });
                            setIsOpenEdit(true);
                          }}
                          style={{ cursor: "pointer", marginLeft: 5 }}
                          size={22}
                          color={"#001B22"}
                        />
                        <MdDelete
                          onClick={() => {
                            confirm({
                              title: "Deseja excluir o cliente?",
                              icon: <ExclamationCircleFilled />,
                              content: `Após essa ação, o cliente ${client.name} será excluido.`,
                              onOk() {
                                deleteClient(client);
                              },
                              onCancel() {},
                              cancelText: "Cancelar",
                            });
                          }}
                          style={{ cursor: "pointer", marginLeft: 5 }}
                          size={22}
                          color={"#001B22"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <center style={{ marginTop: 15 }}>
                <Pagination
                  simple
                  defaultCurrent={page + 1}
                  onChange={(page) => {
                    setPage(page - 1);
                  }}
                  total={clientsTotal}
                  pageSize={30}
                  showTotal={(total) => `${total} clientes`}
                />
              </center>
            </>
          ) : (
            <div className="error">
              <p>Nenhum cliente encontrado</p>
            </div>
          )}
        </>
      )}

      {isLoading && <Loader />}
      <Modal
        title="Novo Cliente"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpen}
        okText="CADASTRAR CLIENTE"
        cancelText="FECHAR"
        onOk={() => {
          createClient();
        }}
        onCancel={() => {
          setIsOpen(false);
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
          <div
            style={{
              marginTop: 0,
              display: "flex",
              width: "100%",
              alignItems: "end",
              height: 120,
              borderRadius: 10,
              marginBottom: 25,
              marginBottom: 20,
              justifyContent: "center",
            }}
          >
            <img
              style={{
                width: 120,
                marginLeft: 50,
                height: 120,
                borderRadius: 10,
                background: "#fff",
              }}
              src={
                photo.photo_url
                  ? photo.photo_url
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
              }
            />
            <button
              style={{
                width: 50,
                height: 50,
                background: "transparent",
              }}
            >
              <label
                for="avatar"
                style={{
                  display: "flex",
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <MdAddPhotoAlternate color="#001B22" size={25} />
                <input
                  id="avatar"
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*;capture=camera"
                  capture
                  onChange={(file) => {
                    let photo = file.target.files[0];
                    photo.photo_url = URL.createObjectURL(file.target.files[0]);
                    setPhoto(photo);
                  }}
                />
              </label>
            </button>
          </div>
          <ViewInput>
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>CPF*</p>
            <InputTel
              mask="999.999.999-99"
              maskChar=""
              noSpaceBetweenChars={true}
              placeholder="cpf"
              value={cpf}
              onChange={(event) =>
                setCpf(event.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </ViewInput>
          <ViewInput>
            <p>Endereço*</p>
            <Input
              placeholder="endereço"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Telefone*</p>
            <InputTel
              mask="(99) 99999-9999"
              maskChar=""
              noSpaceBetweenChars={true}
              value={phone_number}
              placeholder={"telefone"}
              onChange={(text) => {
                setPhone_number(text.target.value.replace(/[^0-9]/g, ""));
              }}
            />
          </ViewInput>
          <ViewInput>
            <p>Crédito ( Sugestão de R$ 50.000,00 )</p>
            <IntlCurrencyInput
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                borderWidth: 0,
                color: "#001B22",
                padding: "8px",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "#ccc",
                borderStyle: "solid",
                borderRadius: 2,
                fontWeight: "400",
                paddingLeft: 12,
              }}
              currency="BRL"
              config={currencyConfig}
              value={credit}
              onChange={(event, value) => setCredit(value)}
            />
          </ViewInput>
        </div>
      </Modal>
      <Modal
        title="Editar Cliente"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenEdit}
        okText="EDITAR CLIENTE"
        cancelText="FECHAR"
        onOk={() => {
          editClient();
        }}
        onCancel={() => {
          setIsOpenEdit(false);
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
          <div
            style={{
              marginTop: 0,
              display: "flex",
              width: "100%",
              alignItems: "end",
              height: 120,
              borderRadius: 10,
              marginBottom: 25,
              marginBottom: 20,
              justifyContent: "center",
            }}
          >
            <img
              style={{
                width: 120,
                marginLeft: 50,
                height: 120,
                borderRadius: 10,
                background: "#fff",
              }}
              src={
                photo.photo_url
                  ? photo.photo_url
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
              }
            />
            <button
              style={{
                width: 50,
                height: 50,
                background: "transparent",
              }}
            >
              <label
                for="avatar"
                style={{
                  display: "flex",
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <MdAddPhotoAlternate color="#001B22" size={25} />
                <input
                  id="avatar"
                  style={{ display: "none" }}
                  type="file"
                  accept="image/"
                  onChange={(file) => {
                    let photo = file.target.files[0];
                    photo.photo_url = URL.createObjectURL(file.target.files[0]);
                    setPhoto(photo);
                  }}
                />
              </label>
            </button>
          </div>
          <ViewInput>
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>CPF*</p>
            <InputTel
              mask="999.999.999-99"
              maskChar=""
              noSpaceBetweenChars={true}
              placeholder="cpf"
              value={cpf}
              onChange={(event) =>
                setCpf(event.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </ViewInput>
          <ViewInput>
            <p>Endereço*</p>
            <Input
              placeholder="endereço"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Telefone*</p>
            <InputTel
              mask="(99) 99999-9999"
              maskChar=""
              noSpaceBetweenChars={true}
              value={phone_number}
              placeholder={"telefone"}
              style={{}}
              onChange={(text) => {
                setPhone_number(text.target.value.replace(/[^0-9]/g, ""));
              }}
            />
          </ViewInput>
          <ViewInput>
            <p>Crédito ( Sugestão de R$ 500,00 )</p>
            <IntlCurrencyInput
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                borderWidth: 0,
                color: "#001B22",
                padding: "8px",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "#ccc",
                borderStyle: "solid",
                borderRadius: 2,
                fontWeight: "400",
                paddingLeft: 12,
              }}
              currency="BRL"
              config={currencyConfig}
              value={credit}
              onChange={(event, value) => setCredit(value)}
            />
          </ViewInput>
        </div>
      </Modal>
    </Container>
  );
};

export default Clients;
