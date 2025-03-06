import React, { useEffect, useState } from "react";
import {
  MdAdd,
  MdAddPhotoAlternate,
  MdCategory,
  MdDelete,
  MdEdit,
  MdTrendingUp,
  MdTrolley,
} from "react-icons/md";
import CountUp from "react-countup";
import { ExclamationCircleFilled } from "@ant-design/icons";

import api from "../../services/api";
import { Container, Cards, Card, Table, Title, ViewInput } from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Button, Modal, Input, Select, Pagination, Switch } from "antd";
import IntlCurrencyInput from "react-intl-currency-input";
import MethodsPayment from "../../components/MethodsPayment";
import { getValue } from "../../services/functions";

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

const Estoque = () => {
  const [product, setProduct] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [productsNote, setProductsNote] = useState([]);
  const [valueNote, setValueNote] = useState(0);
  const [productsSelect, setProductsSelect] = useState([]);
  const [page, setPage] = useState(0);
  const [productsTotal, setProductsTotal] = useState(0);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesSelect, setCategoriesSelect] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersSelect, setSuppliersSelect] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAmount, setIsLoadingAmount] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [value, setValue] = useState(0);
  const [costValue, setCostValue] = useState(0);
  const [photo, setPhoto] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);
  const [isOpenAmount, setIsOpenAmount] = useState(false);
  const [isOpenListSupplier, setIsOpenListSupplier] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenSupplier, setIsOpenSupplier] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [methods_transaction, setMethods_transaction] = useState([]);
  const [observation, setObservation] = useState("");
  const [datePayment, setDatePayment] = useState("");
  const [getMethods, setGetMethods] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    loadCategories();
    loadSuppliers();
    setIsLoading(false);
    loadMethods();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page]);

  async function loadMethods() {
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

  async function loadProducts() {
    await api
      .get(`/products?page=${page}`)
      .then((response) => {
        setProducts(response.data.products);
        let products = [
          { value: null, label: "Selecionar produto", disabled: true },
          { value: "add-product", label: "Novo produto" },
        ];
        response.data.products.map((item) => {
          products.push({
            value: item.id,
            label: item.name,
          });
        });
        setProductsSelect(products);
        setProductsTotal(response.data.productsTotal);
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
    setIsLoading(false);
  }

  async function loadCategories() {
    await api
      .get("/categories")
      .then((response) => {
        setCategories(response.data);
        let categories = [
          { value: null, label: "Selecionar categoria", disabled: true },
        ];
        response.data.map((item) => {
          categories.push({
            value: item.id,
            label: item.name,
          });
        });
        setCategoriesSelect(categories);
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

  async function loadSuppliers() {
    await api
      .get("/suppliers")
      .then((response) => {
        setSuppliers(response.data);
        let suppliers = [
          { value: null, label: "Selecionar fornecedor", disabled: true },
        ];
        response.data.map((item) => {
          suppliers.push({
            value: item.id,
            label: item.name,
          });
        });
        setSuppliersSelect(suppliers);
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

  async function createProduct() {
    setIsLoadingModal(true);
    if (!name || !value || !category || !costValue) {
      toast.warning("Preencha todos os campos");
    } else {
      const data = new FormData();
      data.append("name", name);
      data.append("cost_value", costValue);
      data.append("category_id", category);
      data.append("value", value);
      if (photo.name) {
        data.append("file", photo, photo.name);
      }
      await api
        .post(`/product`, data)
        .then((response) => {
          toast.success("Produto criado com sucesso");
          setIsOpen(false);
          loadProducts();
          if (addProduct) {
            setIsOpenAmount(true);
          }
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
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente"
            );
          }
        });
    }
    setIsLoadingModal(false);
  }

  async function editProduct() {
    setIsLoadingModal(true);
    if (!name || !value || !category || !costValue) {
      toast.warning("Preencha todos os campos");
    } else {
      const data = new FormData();
      data.append("name", name);
      data.append("category_id", category);
      data.append("value", value);
      data.append("cost_value", costValue);
      if (photo.name) {
        data.append("file", photo, photo.name);
      }
      await api
        .put(`/product/${id}`, data)
        .then(() => {
          toast.success("Produto editado com sucesso");
          loadProducts();
          setIsOpenEdit(false);
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
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente"
            );
          }
        });
    }
    setIsLoadingModal(false);
  }

  async function deleteProduct(product) {
    await api
      .delete(`/product/${product.id}`)
      .then(() => {
        loadProducts();
        toast.success("Produto deletado com sucesso");
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

  async function createAndEditCategory() {
    setIsLoadingCategory(true);
    if (!name) {
      toast.warning("Preencha o nome da categoria");
    } else {
      if (id) {
        await api
          .put(`/category/${id}`, {
            name: name,
          })
          .then(() => {
            toast.success("Categoria editada com sucesso");
            loadCategories();
            setIsOpenCategory(false);
            setIsOpenList(true);
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
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente"
              );
            }
          });
      } else {
        await api
          .post(`/category`, {
            name: name,
          })
          .then(() => {
            toast.success("Categoria criada com sucesso");
            loadCategories();
            setIsOpenCategory(false);
            setIsOpenList(true);
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
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente"
              );
            }
          });
      }
    }
    setIsLoadingCategory(false);
  }

  async function deleteCategory(category) {
    await api
      .delete(`/category/${category.id}`)
      .then(() => {
        loadCategories();
        toast.success("Categoria deletada com sucesso");
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

  async function createAndEditSupplier() {
    setIsLoadingSupplier(true);
    if (!name) {
      toast.warning("Preencha o nome da categoria");
    } else {
      if (id) {
        await api
          .put(`/supplier/${id}`, {
            name: name,
          })
          .then(() => {
            toast.success("Fornecedor editado com sucesso");
            loadSuppliers();
            setIsOpenSupplier(false);
            setIsOpenListSupplier(true);
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
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente"
              );
            }
          });
      } else {
        await api
          .post(`/supplier`, {
            name: name,
          })
          .then(() => {
            toast.success("Categoria criada com sucesso");
            loadSuppliers();
            setIsOpenSupplier(false);
            setIsOpenListSupplier(true);
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
              toast.error(
                "Erro Interno. verifique sua conexão e tente novamente"
              );
            }
          });
      }
    }
    setIsLoadingSupplier(false);
  }

  async function deleteSupplier(supplier) {
    await api
      .delete(`/supplier/${supplier.id}`)
      .then(() => {
        loadCategories();
        toast.success("Fornecedor deletado com sucesso");
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

  async function amountProduct() {
    setIsLoadingAmount(true);
    if (!productsNote.length || !supplier) {
      toast.warning("Adicione pelo menos um produto e o fornecedor");
    } else {
      let value = 0;

      productsNote.map((item, index) => {
        value += item["amount"] * item["cost_value"];
      });

      let methods_transactionC = methods_transaction.filter(
        (item) => item.id != "Crédito"
      );

      if (methods_transactionC.length) {
        if (
          methods_transaction.filter((item) => !item.id || !item.value).length
        ) {
          toast.warn("Selecione o método de pagamento e o valor");
          setIsLoadingAmount(false);
          return "";
        }

        if (
          value <
          methods_transaction
            .map((method) => method["value"])
            .reduce((total, value) => total + value)
        ) {
          toast.warn("Valor restante não pode ser negativo");
          setIsLoadingAmount(false);
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
              setIsLoadingAmount(false);
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
          setIsLoadingAmount(false);
          return "";
        }
      }

      await api
        .post(`/invoice`, {
          products: productsNote,
          identifier: identifier,
          datePayment: datePayment,
          supplier_id: supplier,
          methods_transaction: methods_transactionC,
          observation: observation,
        })
        .then(() => {
          toast.success("Estoque adicionado com sucesso");
          loadProducts();
          setIsOpenAmount(false);
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
            toast.error(
              "Erro Interno. verifique sua conexão e tente novamente"
            );
          }
        });
    }
    setIsLoadingAmount(false);
  }
  return (
    <Container>
      <Title>
        <h2>Estoque do Bar</h2>
        <div>
          {!isLoading && (
            <Button
              type="primary"
              onClick={() => {
                setProduct(null);
                setAmount(null);
                setSupplier(null);
                setIdentifier(null);
                setCostValue(0);
                setValueNote(0);
                setProductsNote([]);
                setMethods_transaction([]);
                setDatePayment("");
                setObservation("");
                setIsOpenAmount(true);
              }}
            >
              <MdCategory size="20" color="#fff" />
              <span>Adicionar Estoque</span>
            </Button>
          )}
          {!isLoading && (
            <Button
              type="primary"
              onClick={() => {
                setIsOpenListSupplier(true);
              }}
            >
              <MdCategory size="20" color="#fff" />
              <span>Fornecedores</span>
            </Button>
          )}
          {!isLoading && (
            <Button
              type="primary"
              onClick={() => {
                setIsOpenList(true);
              }}
            >
              <MdCategory size="20" color="#fff" />
              <span>Categorias</span>
            </Button>
          )}
          {!isLoading && (
            <Button
              type="primary"
              onClick={() => {
                setId("");
                setName("");
                setAmount(null);
                setCategory(null);
                setValue(0);
                setCostValue(0);
                setPhoto("");
                setAddProduct(false);
                setIsOpen(true);
              }}
            >
              <MdAdd size="20" color="#fff" />
              <span>Novo Produto</span>
            </Button>
          )}
        </div>
      </Title>

      {!isLoading && (
        <>
          <Cards>
            <Card>
              <div className="icon">
                <MdTrolley color="#848484" size={32} />
              </div>
              <div className="number">
                <CountUp duration={1} end={productsTotal} />
                <p>Total</p>
              </div>
            </Card>
          </Cards>
          {products.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td style={{ width: 50 }}></td>
                    <td>Produto</td>
                    <td style={{ textAlign: "center" }}>Categoria</td>
                    <td style={{ textAlign: "center" }}>Quantidade</td>
                    <td style={{ textAlign: "center" }}>Custo Uni</td>
                    <td style={{ textAlign: "center" }}>Valor Uni</td>
                    <td style={{ width: 80 }}></td>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
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
                      <td style={{ textAlign: "center" }}>
                        {product.category
                          ? product.category.name
                          : "Sem Categoria"}
                      </td>
                      <td style={{ textAlign: "center" }}>{product.amount}x</td>
                      <td style={{ textAlign: "center" }}>
                        {product.cost_value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {product.value.toLocaleString("pt-br", {
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
                        <MdEdit
                          onClick={() => {
                            setId(product.id);
                            setName(product.name);
                            setAmount(product.amount);
                            setValue(product.value);
                            setCostValue(product.cost_value);
                            setCategory(product.category_id);
                            setPhoto({ photo_url: product.photo_url });
                            setIsOpenEdit(true);
                          }}
                          style={{ cursor: "pointer", marginLeft: 5 }}
                          size={22}
                          color={"#001B22"}
                        />
                        <MdDelete
                          onClick={() => {
                            confirm({
                              title: "Deseja excluir o Produto?",
                              icon: <ExclamationCircleFilled />,
                              content: `Após essa ação, o produto ${product.name} será excluido.`,
                              onOk() {
                                deleteProduct(product);
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
                  total={productsTotal}
                  pageSize={30}
                  showTotal={(total) => `${total} produtos`}
                />
              </center>
            </>
          ) : (
            <div className="error">
              <p>Nenhum produto encontrado</p>
            </div>
          )}
        </>
      )}

      {isLoading && <Loader />}
      <Modal
        title="Novo Produto"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpen}
        okText="CADASTRAR PRODUTO"
        cancelText="FECHAR"
        onOk={() => {
          createProduct();
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
                  : "https://png.pngtree.com/png-vector/20191126/ourmid/pngtree-trolley-cargo-icon-png-image_2036122.jpg"
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
            <p>Categoria*</p>
            <Select
              value={category}
              style={{ width: "100%", textAlign: "left" }}
              onChange={(value) => {
                setCategory(value);
              }}
              options={categoriesSelect}
            />
          </ViewInput>
          <ViewInput>
            <p>Valor*</p>
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
              value={value}
              onChange={(event, value) => setValue(value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Custo*</p>
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
              value={costValue}
              onChange={(event, value) => setCostValue(value)}
            />
          </ViewInput>
        </div>
      </Modal>
      <Modal
        title="Editar Produto"
        width={500}
        confirmLoading={isLoadingModal}
        open={isOpenEdit}
        okText="EDITAR PRODUTO"
        cancelText="FECHAR"
        onOk={() => {
          editProduct();
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
                  : "https://png.pngtree.com/png-vector/20191126/ourmid/pngtree-trolley-cargo-icon-png-image_2036122.jpg"
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
            <p>Quantidade</p>
            <Input
              disabled={true}
              placeholder="quantidade"
              value={amount}
              type="number"
              onChange={(event) => setAmount(event.target.value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Categoria*</p>
            <Select
              value={category}
              style={{ width: "100%", textAlign: "left" }}
              onChange={(value) => {
                setCategory(value);
              }}
              options={categoriesSelect}
            />
          </ViewInput>
          <ViewInput>
            <p>Valor*</p>
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
              value={value}
              onChange={(event, value) => setValue(value)}
            />
          </ViewInput>
          <ViewInput>
            <p>Custo*</p>
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
              value={costValue}
              onChange={(event, value) => setCostValue(value)}
            />
          </ViewInput>
        </div>
      </Modal>
      <Modal
        title={`${categories.length} Categorias`}
        width={500}
        open={isOpenList}
        okText="NOVA CATEGORIA"
        cancelText="FECHAR"
        onOk={() => {
          setIsOpenList(false);
          setName("");
          setId("");
          setIsOpenCategory(true);
        }}
        onCancel={() => {
          loadProducts();
          setIsOpenList(false);
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
          {!isLoading && (
            <>
              {categories.length ? (
                <Table style={{ marginTop: 0 }}>
                  <thead>
                    <tr>
                      <td>Nome da Categoria</td>
                      <td style={{ width: 80 }}></td>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MdEdit
                            onClick={() => {
                              setId(category.id);
                              setName(category.name);
                              setIsOpenList(false);
                              setIsOpenCategory(true);
                            }}
                            style={{ cursor: "pointer", marginLeft: 5 }}
                            size={22}
                            color={"#001B22"}
                          />
                          <MdDelete
                            onClick={() => {
                              confirm({
                                title: "Deseja excluir a Categoria?",
                                icon: <ExclamationCircleFilled />,
                                content: `Após essa ação, a categoria ${category.name} será excluida.`,
                                onOk() {
                                  deleteCategory(category);
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
              ) : (
                <div className="error">
                  <p>Nenhuma categoria encontrada</p>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
      <Modal
        title={"Adicionar Estoque"}
        width={500}
        confirmLoading={isLoadingAmount}
        open={isOpenAmount}
        okText="ADICIONAR ESTOQUE"
        cancelText="FECHAR"
        onOk={() => {
          amountProduct();
        }}
        onCancel={() => {
          setIsOpenAmount(false);
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
          <h3>Nota</h3>
          {!productsNote.length && (
            <div
              style={{
                width: "100%",
                background: "#f0f0f0",
                padding: "5px",
                marginBottom: 8,
              }}
            >
              <p style={{ textAlign: "center" }}>
                Nenhum produto adicionado a nota
              </p>
            </div>
          )}
          {productsNote.map((item) => {
            return (
              <h4 style={{ marginBottom: 0 }}>
                {item.name} {item.amount}x Custo: {getValue(item.cost_value)}
              </h4>
            );
          })}
          <ViewInput style={{ marginTop: 5 }}>
            <p>Fornecedor*</p>
            <Select
              value={supplier}
              style={{ width: "100%", textAlign: "left" }}
              onChange={(value) => {
                setSupplier(value);
              }}
              options={suppliersSelect}
            />
          </ViewInput>
          <ViewInput style={{ marginTop: 5 }}>
            <p>Identificador*</p>
            <Input
              value={identifier}
              placeholder="identificação da nota"
              style={{ width: "100%", textAlign: "left" }}
              onChange={(event) => {
                setIdentifier(event.target.value);
              }}
            />
          </ViewInput>
          {supplier && identifier && (
            <>
              <h3>Adicione Produtos a Nota</h3>
              <ViewInput>
                <p>Produto*</p>
                <Select
                  value={product}
                  style={{ width: "100%", textAlign: "left" }}
                  onChange={(value) => {
                    if (value == "add-product") {
                      setId("");
                      setName("");
                      setAmount(null);
                      setCategory(null);
                      setValue(0);
                      setCostValue(0);
                      setPhoto("");
                      setIsLoadingAmount(false);
                      setAddProduct(true);
                      setIsOpen(true);
                    } else {
                      setProduct(value);
                      let product = products.filter(
                        (item) => item.id == value
                      )[0];
                      setProductName(product.name);
                      setCostValue(product.cost_value);
                    }
                  }}
                  options={productsSelect}
                />
              </ViewInput>
              {product && (
                <>
                  <ViewInput>
                    <p>Quantidade</p>
                    <Input
                      placeholder="quantidade"
                      value={amount}
                      type="number"
                      onChange={(event) => setAmount(event.target.value)}
                    />
                  </ViewInput>
                  <ViewInput>
                    <p>Custo*</p>
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
                      value={costValue}
                      onChange={(event, value) => setCostValue(value)}
                    />
                  </ViewInput>
                </>
              )}
            </>
          )}

          {product && costValue && amount && (
            <Button
              style={{
                width: 200,
                margin: "5PX 0 10PX 0",
                background: "#00c281",
                color: "#FFF",
                border: "none",
              }}
              onClick={() => {
                let products = [...productsNote];
                products.push({
                  product_id: product,
                  name: productName,
                  cost_value: costValue,
                  amount: amount,
                });
                setProductsNote(products);
                setValueNote(valueNote + costValue * amount);
                setProduct(null);
                setAmount("");
                setCostValue("");
              }}
            >
              ADICIONAR A NOTA
            </Button>
          )}
          {!!productsNote.length && (
            <>
              <h4>Total da Transação: {getValue(valueNote)}</h4>
              <ViewInput style={{ textAlign: "left" }}>
                <p>Métodos de pagamento</p>
                <MethodsPayment
                  getMethods={getMethods}
                  operation="saida"
                  methodsPayment={methods_transaction}
                  value={valueNote}
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
                      })
                    );
                  }}
                />
              </ViewInput>
            </>
          )}
        </div>
      </Modal>
      <Modal
        title={id ? "Editando Categoria" : "Criando Categoria"}
        width={500}
        confirmLoading={isLoadingCategory}
        open={isOpenCategory}
        okText="SALVAR CATEGORIA"
        cancelText="FECHAR"
        onOk={() => {
          createAndEditCategory();
        }}
        onCancel={() => {
          setIsOpenCategory(false);
          setIsOpenList(true);
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
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>
        </div>
      </Modal>

      <Modal
        title={`${suppliers.length} Fornecedores`}
        width={500}
        open={isOpenListSupplier}
        okText="NOVO FORNECEDOR"
        cancelText="FECHAR"
        onOk={() => {
          setIsOpenListSupplier(false);
          setName("");
          setId("");
          setIsOpenSupplier(true);
        }}
        onCancel={() => {
          loadProducts();
          setIsOpenListSupplier(false);
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
          {!isLoading && (
            <>
              {suppliers.length ? (
                <Table style={{ marginTop: 0 }}>
                  <thead>
                    <tr>
                      <td>Nome do Fornecedor</td>
                      <td style={{ width: 80 }}></td>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((category) => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MdEdit
                            onClick={() => {
                              setId(category.id);
                              setName(category.name);
                              setIsOpenList(false);
                              setIsOpenCategory(true);
                            }}
                            style={{ cursor: "pointer", marginLeft: 5 }}
                            size={22}
                            color={"#001B22"}
                          />
                          <MdDelete
                            onClick={() => {
                              confirm({
                                title: "Deseja excluir o Fornecedor?",
                                icon: <ExclamationCircleFilled />,
                                content: `Após essa ação, o fornecedor ${category.name} será excluido.`,
                                onOk() {
                                  deleteSupplier(category);
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
              ) : (
                <div className="error">
                  <p>Nenhuma fornecedor encontrada</p>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
      <Modal
        title={id ? "Editando Fornecedor" : "Criando Fornecedor"}
        width={500}
        confirmLoading={isLoadingSupplier}
        open={isOpenSupplier}
        okText="SALVAR FORNECEDOR"
        cancelText="FECHAR"
        onOk={() => {
          createAndEditSupplier();
        }}
        onCancel={() => {
          setIsOpenSupplier(false);
          setIsOpenListSupplier(true);
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
            <p>Nome*</p>
            <Input
              placeholder="nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </ViewInput>
        </div>
      </Modal>
    </Container>
  );
};

export default Estoque;
