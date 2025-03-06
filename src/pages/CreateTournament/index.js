import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import {
  Container,
  Title,
  ViewInput,
  ContainerInputs,
  ViewPurchase,
  ButtonAdd,
  ViewRow,
  ViewRanking,
} from "./styles";
import { toast } from "react-toastify";
import { AutoComplete, Button, Input, Modal, Select, Switch } from "antd";
import IntlCurrencyInput from "react-intl-currency-input";
import Loader from "../../components/Loader";
import { useQuery } from "../../hooks/Location";
import { MdAdd, MdAddCircle, MdDelete, MdEdit } from "react-icons/md";

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

const CreateTournament = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const [name, setName] = useState("");
  const [timechip, setTimechip] = useState(0);
  const [chairs, setChairs] = useState(0);
  const [totalAward_guaranteed, setTotalAward_guaranteed] = useState(0);
  const [timer_round, setTimer_round] = useState(0);
  const [timer_interval, setTimer_interval] = useState(0);
  const [namePurchase, setNamePurchase] = useState("");
  const [tokenPurchase, setTokenPurchase] = useState("");
  const [typePurchase, setTypePurchase] = useState("");
  const [valuePurchase, setValuePurchase] = useState(0);
  const [isStaff, setIsStaff] = useState(false);
  const [cashierPurchase, setCashierPurchase] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [vacancyEnable, setVacancyEnable] = useState(false);
  const [staffValue, setStaffValue] = useState(0);
  const [staffToken, setStaffToken] = useState(0);
  const [visibleModal, setVisibleModal] = useState(0);
  const [position, setPosition] = useState(0);
  const [nivel_max_in, setNivel_max_in] = useState(0);
  const [nivel_max_timechip, setNivel_max_timechip] = useState(0);
  const [percentage_players_award, setPercentage_players_award] = useState(0);
  const [vacancys, setVacancys] = useState([]);
  const [rounds_to_interval, setRounds_to_interval] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState(false);
  const [visibleModalRanking, setVisibleModalRanking] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [rankingsTournament, setRankingsTournament] = useState([]);
  const [indexRanking, setIndexRanking] = useState([]);
  const [vacancysSearch, setVacancysSearch] = useState([]);

  async function loadVacancys() {
    await api
      .get(`/group/vacancys`)
      .then((response) => {
        let vacancys = response.data;
        vacancys.map((item) => {
          item.label = item.name;
          item.value = item.name;
        });
        setVacancysSearch(vacancys);
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

  async function createTournament() {
    setIsLoading(true);
    if (
      !name ||
      !chairs ||
      !totalAward_guaranteed ||
      !timer_round ||
      !timer_interval ||
      !rounds_to_interval ||
      !nivel_max_in ||
      !percentage_players_award ||
      (vacancyEnable && !vacancys.length)
    ) {
      toast.warning("Preencha os campos obrigatórios");
      setError(true);
      setIsLoading(false);
    } else {
      if (vacancyEnable) {
        const hasEmptyFields = vacancys.some(
          (vacancy) => !vacancy.name || !vacancy.value
        );
        if (hasEmptyFields) {
          toast.warning(`Preencha o valor e nome das vagas`);
          setError(true);
          setIsLoading(false);
          return true;
        }
      }
      if (rankingsTournament.length) {
        const hasError = rankingsTournament.some((item) => {
          if (!item.value) {
            toast.warning(`Preencha o valor para o ranking ${item.name}`);
            setError(true);
            setIsLoading(false);
            return true;
          }

          return item.rules.some((data, idx) => {
            if (!data.max || !data.points) {
              toast.warning(
                `Preencha todos os campos das faixas de pontuação do ranking ${item.name}`
              );
              setError(true);
              setIsLoading(false);
              return true;
            }
            if (data.min > data.max) {
              toast.warning(
                `Faixa de pontuação do ranking ${
                  item.name
                }, verifique a linha ${idx + 1}`
              );
              setError(true);
              setIsLoading(false);
              return true;
            }
            return false;
          });
        });

        if (hasError) return;
      }
      await api
        .post(`/tournament`, {
          name: name,
          timechip: timechip ? parseInt(timechip) : 0,
          chairs: parseInt(chairs),
          totalAward_guaranteed: parseFloat(totalAward_guaranteed),
          timer_round: parseInt(timer_round),
          timer_interval: parseInt(timer_interval),
          rounds_to_interval: parseInt(rounds_to_interval),
          nivel_max_in: parseInt(nivel_max_in),
          nivel_max_timechip: nivel_max_timechip
            ? parseInt(nivel_max_timechip)
            : 0,
          percentage_players_award: parseFloat(percentage_players_award),
          purchases: purchases,
          vacancys: vacancys,
          rankings: rankingsTournament,
        })
        .then((response) => {
          toast.success("Torneio criado com sucesso");
          navigate(`/torneio/${response.data.id}`);
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
      setIsLoading(false);
    }
  }
  async function loadRankings() {
    await api
      .get(`/rankings?all=true`)
      .then((response) => {
        const rankigs = response.data.rankings.filter(
          (item) => item.status == "andamento"
        );
        rankigs.map((item) => {
          item.value = item.id;
          item.label = item.name;
        });
        setRankings(rankigs);
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

  async function loadTournament() {
    await api
      .get(`/tournament/${query.get("copy")}`)
      .then((response) => {
        let tournament = response.data;
        setTimechip(tournament.timechip);
        setChairs(tournament.chairs);
        setTotalAward_guaranteed(tournament.totalAward_guaranteed);
        setTimer_round(tournament.timer_round);
        setTimer_interval(tournament.timer_interval);
        setRounds_to_interval(tournament.rounds_to_interval);
        setNivel_max_in(tournament.max_in);
        setNivel_max_timechip(tournament.max_timechip);
        setPercentage_players_award(tournament.percentage_players_award);
        setPurchases(tournament.purchases);
        setVacancyEnable(!!tournament.vacancys.length);
        setVacancys(tournament.vacancys);
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

  function saveOption() {
    if (
      !namePurchase ||
      !cashierPurchase ||
      !valuePurchase ||
      (typePurchase != "service" && !tokenPurchase) ||
      (isStaff && !staffToken)
    ) {
      setErrorModal(true);
      toast.warn("Preencha todos os campos para salvar");
    } else {
      if (position) {
        let purchasesC = [...purchases];
        purchasesC[position - 1] = {
          name: namePurchase,
          value: valuePurchase,
          cashier: cashierPurchase,
          token: tokenPurchase,
          is_staff: isStaff,
          value_staff: staffValue,
          token_staff: staffToken,
          type: typePurchase,
        };
        setPurchases(purchasesC);
      } else {
        let purchasesC = [...purchases];
        purchasesC.push({
          name: namePurchase,
          value: valuePurchase,
          cashier: cashierPurchase,
          token: tokenPurchase,
          is_staff: isStaff,
          value_staff: staffValue,
          token_staff: staffToken,
          type: typePurchase,
        });
        setPurchases(purchasesC);
      }
      setVisibleModal(false);
    }
  }

  useEffect(() => {
    setIsLoadingPage(true);
    if (query.get("copy")) {
      loadTournament();
    }
    loadVacancys();
    loadRankings();
    setIsLoadingPage(false);
  }, []);

  return (
    <Container>
      <Title>
        <h2>Novo Torneio</h2>
      </Title>
      {!isLoadingPage ? (
        <ContainerInputs>
          <div style={{ display: "flex", width: "100%" }}>
            <ViewInput style={{ width: "100%", maxWidth: 400 }}>
              <p>Nome do Torneio</p>
              <Input
                status={error && !name && "error"}
                placeholder="nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </ViewInput>
          </div>
          <ViewInput style={{ width: "100%" }}>
            <p>Opções de Entrada</p>
            <ViewRow>
              {purchases.map((purchase, index) => {
                if (purchase.type == "entrie") {
                  return (
                    <ViewPurchase>
                      <div className="content">
                        <h4>{purchase.name}</h4>
                        <p>Valor: {purchase.value}</p>
                        <p>Fichas: {purchase.token}</p>
                        <p style={{ textTransform: "capitalize" }}>
                          Caixa: {purchase.cashier}
                        </p>
                        {purchase.is_staff && (
                          <>
                            <p>Staff Valor: {purchase.value_staff}</p>
                            <p>Staff Fichas: {purchase.token_staff}</p>
                          </>
                        )}
                      </div>
                      <div className="actions">
                        <MdEdit
                          color="#000"
                          size={18}
                          onClick={() => {
                            setPosition(index + 1);
                            setNamePurchase(purchase.name);
                            setValuePurchase(purchase.value);
                            setTokenPurchase(purchase.token);
                            setIsStaff(purchase.is_staff);
                            setCashierPurchase(purchase.cashier);
                            setStaffToken(purchase.token_staff);
                            setStaffValue(purchase.value_staff);
                            setTypePurchase("entrie");
                            setErrorModal(false);
                            setVisibleModal(true);
                          }}
                        />
                        <MdDelete
                          color="#000"
                          size={18}
                          onClick={() => {
                            setPurchases(
                              purchases.filter((item, idx) => idx != index)
                            );
                          }}
                        />
                      </div>
                    </ViewPurchase>
                  );
                }
              })}
              <ButtonAdd
                className={
                  error &&
                  !purchases.some((purchase) => purchase.type == "entrie") &&
                  "errorButton"
                }
                onClick={() => {
                  setNamePurchase("");
                  setCashierPurchase("clube");
                  setValuePurchase("");
                  setTokenPurchase("");
                  setIsStaff(false);
                  setPosition(0);
                  setTypePurchase("entrie");
                  setErrorModal(false);
                  setVisibleModal(true);
                }}
              >
                <MdAdd color="#000" size={35} />
              </ButtonAdd>
            </ViewRow>
          </ViewInput>
          <ViewInput style={{ width: "100%" }}>
            <p>Opções de Compra</p>
            <ViewRow>
              {purchases.map((purchase, index) => {
                if (purchase.type == "purchase") {
                  return (
                    <ViewPurchase>
                      <div className="content">
                        <h4>{purchase.name}</h4>
                        <p>Valor: {purchase.value}</p>
                        <p>Fichas: {purchase.token}</p>
                        <p>Caixa: {purchase.cashier}</p>
                        {purchase.is_staff && (
                          <>
                            <p>Staff Valor: {purchase.value_staff}</p>
                            <p>Staff Fichas: {purchase.token_staff}</p>
                          </>
                        )}
                      </div>
                      <div className="actions">
                        <MdEdit
                          color="#000"
                          size={18}
                          onClick={() => {
                            setPosition(index + 1);
                            setNamePurchase(purchase.name);
                            setValuePurchase(purchase.value);
                            setTokenPurchase(purchase.token);
                            setIsStaff(purchase.is_staff);
                            setCashierPurchase(purchase.cashier);
                            setStaffToken(purchase.token_staff);
                            setStaffValue(purchase.value_staff);
                            setTypePurchase("purchase");
                            setErrorModal(false);
                            setVisibleModal(true);
                          }}
                        />
                        <MdDelete
                          color="#000"
                          size={18}
                          onClick={() => {
                            setPurchases(
                              purchases.filter((item, idx) => idx != index)
                            );
                          }}
                        />
                      </div>
                    </ViewPurchase>
                  );
                }
              })}
              <ButtonAdd
                onClick={() => {
                  setNamePurchase("");
                  setCashierPurchase("clube");
                  setValuePurchase("");
                  setTokenPurchase("");
                  setIsStaff(false);
                  setPosition(0);
                  setTypePurchase("purchase");
                  setErrorModal(false);
                  setVisibleModal(true);
                }}
              >
                <MdAdd color="#000" size={35} />
              </ButtonAdd>
            </ViewRow>
          </ViewInput>
          <ViewInput style={{ width: "100%" }}>
            <p>Opções de Serviços</p>
            <ViewRow>
              {purchases.map((purchase, index) => {
                if (purchase.type == "service") {
                  return (
                    <ViewPurchase>
                      <div className="content">
                        <h4>{purchase.name}</h4>
                        <p>Valor: {purchase.value}</p>
                        <p>Caixa: {purchase.cashier}</p>
                      </div>
                      <div className="actions">
                        <MdEdit
                          color="#000"
                          size={18}
                          onClick={() => {
                            setPosition(index + 1);
                            setNamePurchase(purchase.name);
                            setValuePurchase(purchase.value);
                            setCashierPurchase(purchase.cashier);
                            setTypePurchase("service");
                            setErrorModal(false);
                            setVisibleModal(true);
                          }}
                        />
                        <MdDelete
                          color="#000"
                          size={18}
                          onClick={() => {
                            setPurchases(
                              purchases.filter((item, idx) => idx != index)
                            );
                          }}
                        />
                      </div>
                    </ViewPurchase>
                  );
                }
              })}
              <ButtonAdd
                onClick={() => {
                  setNamePurchase("");
                  setCashierPurchase("");
                  setValuePurchase("");
                  setPosition(0);
                  setTypePurchase("service");
                  setErrorModal(false);
                  setVisibleModal(true);
                }}
              >
                <MdAdd color="#000" size={35} />
              </ButtonAdd>
            </ViewRow>
          </ViewInput>
          <ViewInput style={{ width: "415px" }}>
            <p>Vincular Ranking</p>
            <Select
              value={""}
              placeholder="adicionar ranking"
              dropdownStyle={{ color: "#000" }}
              style={{ width: "100%", fontSize: 14 }}
              onChange={(value, data) => {
                if (rankingsTournament.some((item) => item.id === value)) {
                  toast.warn("Ranking já vinculado, edite ou delete abaixo");
                } else {
                  setIndexRanking(rankingsTournament.length);
                  setRankingsTournament([
                    ...rankingsTournament,
                    {
                      id: value,
                      name: data.label,
                      rules: [
                        {
                          min: 1,
                          max: "",
                          points: "",
                        },
                      ],
                      value: 0,
                    },
                  ]);
                  setVisibleModalRanking(true);
                }
              }}
              options={rankings}
            />
            {rankingsTournament.map((item, idx) => (
              <ViewRanking>
                <p>{item.name}</p>
                <div>
                  <MdEdit
                    onClick={() => {
                      setIndexRanking(idx);
                      setVisibleModalRanking(true);
                    }}
                  />
                  <MdDelete
                    onClick={() => {
                      setRankingsTournament(
                        rankingsTournament.filter((data) => item.id != data.id)
                      );
                    }}
                  />
                </div>
              </ViewRanking>
            ))}
          </ViewInput>

          <ViewInput style={{ width: "100%" }}>
            <p>Habilitar Vagas?</p>
            <Switch
              style={{
                minWidth: 20,
                padding: 0,
                borderRadius: 15,
                marginTop: 5,
              }}
              checked={vacancyEnable}
              onChange={() => {
                if (vacancyEnable) {
                  setVacancys([]);
                } else {
                  setVacancys([
                    {
                      value: "",
                      name: "",
                      description: "",
                    },
                  ]);
                }
                setVacancyEnable(!vacancyEnable);
              }}
            />
          </ViewInput>
          {vacancys.map((item, idx) => {
            return (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <ViewInput style={{ width: "100%", maxWidth: 260 }}>
                  <p>Nome</p>
                  <AutoComplete
                    style={{ width: "100%", fontSize: 14, textAlign: "left" }}
                    options={vacancysSearch.filter((data) => {
                      return data.label
                        .toLowerCase()
                        .includes(item.name.toLowerCase());
                    })}
                    value={item.name}
                    notFoundContent={<>Nenhum cliente encontrado</>}
                    onSelect={(text, vacancy) => {
                      let vacancysEdit = [...vacancys];
                      vacancysEdit[idx].name = vacancy.value;
                      setVacancys([...vacancysEdit]);
                    }}
                    onSearch={(text) => {
                      let vacancysEdit = [...vacancys];
                      vacancysEdit[idx].name = text;
                      setVacancys([...vacancysEdit]);
                    }}
                    placeholder="nome"
                  >
                    <Input
                      status={error && !item.name && "error"}
                      placeholder="nome"
                    />
                  </AutoComplete>
                </ViewInput>
                <ViewInput style={{ width: "100%", maxWidth: 200 }}>
                  <p>Descrição</p>
                  <Input
                    placeholder="descriçao"
                    value={item.description}
                    onChange={(event) => {
                      let vacancysEdit = [...vacancys];
                      vacancysEdit[idx].description = event.target.value;
                      setVacancys([...vacancysEdit]);
                    }}
                  />
                </ViewInput>
                <ViewInput
                  style={{ width: "100%", maxWidth: 140, marginRight: 10 }}
                >
                  <p>Valor</p>
                  <IntlCurrencyInput
                    style={{
                      width: "100%",
                      backgroundColor: "#FFF",
                      borderWidth: 0,
                      color: "#001B22",
                      padding: "8px",
                      fontSize: 14,
                      borderWidth: 1,
                      height: 32,
                      borderColor: error && !item.value ? "#ff4d4f" : "#ccc",
                      borderStyle: "solid",
                      borderRadius: 2,
                      fontWeight: "400",
                      paddingLeft: 12,
                    }}
                    currency="BRL"
                    config={currencyConfig}
                    value={item.value}
                    onChange={(event, value) => {
                      let vacancysEdit = [...vacancys];
                      vacancysEdit[idx].value = value;
                      setVacancys([...vacancysEdit]);
                    }}
                  />
                </ViewInput>
                {vacancys.length > 1 && (
                  <MdDelete
                    onClick={() => {
                      let vacancysEdit = [...vacancys];
                      vacancysEdit.splice(idx, 1);
                      setVacancys([...vacancysEdit]);
                    }}
                  />
                )}
              </div>
            );
          })}
          {vacancyEnable && (
            <Button
              type="primary"
              style={{
                marginTop: 0,
                height: 25,
                minWidth: 100,
                fontSize: 12,
                marginBottom: 15,
              }}
              onClick={() => {
                let vacancyC = [...vacancys];
                vacancyC.push({
                  value: "",
                  name: "",
                  description: "",
                });
                setVacancys([...vacancyC]);
              }}
            >
              Nova Vaga
            </Button>
          )}
          <div style={{ display: "flex", width: "100%" }}>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>Timechip</p>
              <Input
                placeholder="quantidade"
                value={timechip}
                type="number"
                onChange={(event) => setTimechip(parseInt(event.target.value))}
              />
            </ViewInput>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>Quantidade de mesas</p>
              <Input
                status={error && !chairs && "error"}
                placeholder="quantidade"
                value={chairs || ""}
                type="number"
                onChange={(event) => {
                  let value = parseInt(event.target.value) || 0;
                  if (value >= 0 && value <= 20) {
                    setChairs(value);
                  } else {
                    toast.warn("Máximo de 20 mesas");
                  }
                }}
              />
            </ViewInput>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>Premiação garantida</p>
              <IntlCurrencyInput
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  borderWidth: 0,
                  color: "#001B22",
                  padding: "6px",
                  fontSize: 14,
                  height: 32,
                  borderWidth: 1,
                  borderColor:
                    error && !totalAward_guaranteed ? "#ff4d4f" : "#ccc",
                  borderStyle: "solid",
                  borderRadius: 2,
                  fontWeight: "400",
                  paddingLeft: 12,
                }}
                currency="BRL"
                config={currencyConfig}
                value={totalAward_guaranteed}
                onChange={(event, value) => setTotalAward_guaranteed(value)}
              />
            </ViewInput>
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>Tempo dos niveis (em minutos)</p>
              <Input
                placeholder="quantidade"
                status={error && !timer_round && "error"}
                value={timer_round || ""}
                type="number"
                onChange={(event) =>
                  setTimer_round(parseInt(event.target.value))
                }
              />
            </ViewInput>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>Tempo do Intervalo (em minutos)</p>
              <Input
                placeholder="quantidade"
                status={error && !timer_interval && "error"}
                value={timer_interval || ""}
                type="number"
                onChange={(event) =>
                  setTimer_interval(parseInt(event.target.value))
                }
              />
            </ViewInput>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>Quantas niveis para o Intervalo?</p>
              <Input
                placeholder="quantidade"
                status={error && !rounds_to_interval && "error"}
                value={rounds_to_interval || ""}
                type="number"
                onChange={(event) =>
                  setRounds_to_interval(parseInt(event.target.value))
                }
              />
            </ViewInput>
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>% de jogadores premiados</p>
              <Input
                placeholder="0 a 100%"
                status={error && !percentage_players_award && "error"}
                value={percentage_players_award || ""}
                type="number"
                min={0}
                max={100}
                onChange={(event) => {
                  let value = parseFloat(event.target.value) || 0;
                  if (value >= 0 && value <= 100) {
                    setPercentage_players_award(value);
                  } else {
                    toast.warn("Valores da porcentagem é de 0 a 100%");
                  }
                }}
              />
            </ViewInput>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>Nivel máximo timechip</p>
              <Input
                placeholder="0"
                value={nivel_max_timechip}
                type="number"
                onChange={(event) =>
                  setNivel_max_timechip(parseInt(event.target.value))
                }
              />
            </ViewInput>
            <ViewInput style={{ width: "100%", maxWidth: 200 }}>
              <p>Nivel máximo para inscrições</p>
              <Input
                placeholder="0"
                status={error && !nivel_max_in && "error"}
                value={nivel_max_in || ""}
                type="number"
                onChange={(event) =>
                  setNivel_max_in(parseInt(event.target.value))
                }
              />
            </ViewInput>
          </div>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => {
              createTournament();
            }}
          >
            <span>Criar Torneio</span>
          </Button>
        </ContainerInputs>
      ) : (
        <Loader white size={130} />
      )}

      <Modal
        title="Opção de Torneio"
        width={500}
        open={visibleModal}
        okText={position ? "EDITAR" : "ADICIONAR"}
        cancelText="FECHAR"
        onOk={() => {
          saveOption();
        }}
        onCancel={() => {
          setVisibleModal(false);
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
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <ViewInput style={{ width: "49%" }}>
              <p>Nome</p>
              <Input
                placeholder="nome"
                status={errorModal && !namePurchase && "error"}
                value={namePurchase}
                onChange={(event) => setNamePurchase(event.target.value)}
              />
            </ViewInput>
            <ViewInput style={{ width: "49%" }}>
              <p>Caixa</p>
              <Select
                value={cashierPurchase || null}
                placeholder="caixa"
                status={errorModal && !cashierPurchase && "error"}
                dropdownStyle={{ color: "#000" }}
                style={{
                  width: "100%",
                  fontSize: 14,
                }}
                onChange={(text) => {
                  setCashierPurchase(text);
                }}
                disabled={typePurchase != "service"}
                options={
                  typePurchase == "service"
                    ? [
                        {
                          value: "dealer",
                          label: "Dealer",
                        },
                        {
                          value: "passport",
                          label: "Passaporte",
                        },
                        {
                          value: "jackpot",
                          label: "Jackpot",
                        },
                        {
                          value: "clube",
                          label: "Clube",
                        },
                      ]
                    : [
                        {
                          value: "clube",
                          label: "Clube",
                        },
                      ]
                }
              />
            </ViewInput>
          </div>
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            {typePurchase != "service" && (
              <ViewInput style={{ width: "49%" }}>
                <p>Fichas</p>
                <Input
                  placeholder="quantidade"
                  status={errorModal && !tokenPurchase && "error"}
                  value={tokenPurchase || ""}
                  type="number"
                  onChange={(event) =>
                    setTokenPurchase(parseInt(event.target.value))
                  }
                />
              </ViewInput>
            )}
            <ViewInput
              style={{ width: typePurchase != "service" ? "49%" : "100%" }}
            >
              <p>Valor</p>
              <IntlCurrencyInput
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  borderWidth: 0,
                  color: "#001B22",
                  padding: "8px",
                  fontSize: 14,
                  height: 32,
                  borderWidth: 1,
                  borderColor:
                    errorModal && !valuePurchase ? "#ff4d4f" : "#ccc",
                  borderStyle: "solid",
                  borderRadius: 2,
                  fontWeight: "400",
                  paddingLeft: 12,
                }}
                currency="BRL"
                config={currencyConfig}
                value={valuePurchase}
                onChange={(event, value) => setValuePurchase(value)}
              />
            </ViewInput>
          </div>
          {typePurchase != "service" && (
            <ViewInput style={{ width: "100%", maxWidth: 60 }}>
              <p>Staff?</p>
              <Switch
                style={{
                  minWidth: 20,
                  padding: 0,
                  borderRadius: 15,
                  marginTop: 5,
                }}
                checked={isStaff}
                onChange={() => {
                  setIsStaff(!isStaff);
                  setStaffToken("");
                  setStaffValue("");
                }}
              />
            </ViewInput>
          )}
          {(typePurchase != "service" && isStaff) && (
            <>
              <div
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <ViewInput style={{ width: "49%" }}>
                  <p>Staff Fichas</p>
                  <Input
                    placeholder="quantidade"
                    status={errorModal && !staffToken && "error"}
                    value={staffToken || ""}
                    type="number"
                    onChange={(event) =>
                      setStaffToken(parseInt(event.target.value))
                    }
                  />
                </ViewInput>
                <ViewInput style={{ width: "49%" }}>
                  <p>Staff Valor</p>
                  <IntlCurrencyInput
                    style={{
                      width: "100%",
                      backgroundColor: "#FFF",
                      borderWidth: 0,
                      color: "#001B22",
                      padding: "8px",
                      fontSize: 14,
                      height: 32,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderStyle: "solid",
                      borderRadius: 2,
                      fontWeight: "400",
                      paddingLeft: 12,
                    }}
                    currency="BRL"
                    config={currencyConfig}
                    value={staffValue}
                    onChange={(event, value) => setStaffValue(value)}
                  />
                </ViewInput>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        title="Configuração Ranking"
        width={500}
        open={visibleModalRanking}
        okText={"FECHAR"}
        onCancel={() => {
          setVisibleModalRanking(false);
        }}
        onOk={() => {
          setVisibleModalRanking(false);
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
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
          <ViewInput style={{ width: "100%" }}>
            <p>Valor para o Ranking</p>
            <IntlCurrencyInput
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                borderWidth: 0,
                color: "#001B22",
                padding: "8px",
                fontSize: 14,
                height: 32,
                borderWidth: 1,
                borderColor: "#ccc",
                borderStyle: "solid",
                borderRadius: 2,
                fontWeight: "400",
                paddingLeft: 12,
              }}
              currency="BRL"
              config={currencyConfig}
              value={rankingsTournament[indexRanking]?.value}
              onChange={(event, value) => {
                let rankigsEdit = [...rankingsTournament];
                let rankigEdit = {
                  ...rankingsTournament[indexRanking],
                };
                rankigEdit.value = value;
                rankigsEdit[indexRanking] = { ...rankigEdit };
                setRankingsTournament(rankigsEdit);
              }}
            />
          </ViewInput>
          <ViewInput style={{ width: "100%" }}>
            <h4 style={{ textAlign: "left" }}>Faixas de Pontuação</h4>
            <div>
              <p>De</p>
              <p>Até</p>
              <p>Pontos</p>
            </div>
            {rankingsTournament[indexRanking]?.rules.map((data, idx) => {
              return (
                <div>
                  <Input placeholder="de" value={data.min} disabled={true} />
                  <Input
                    placeholder="até"
                    value={data.max}
                    onChange={(event) => {
                      let rankigsEdit = [...rankingsTournament];
                      let rankigEdit = { ...rankingsTournament[indexRanking] };
                      rankigEdit.rules[idx].max =
                        parseInt(event.target.value) || "";
                      if (rankigEdit.rules[idx + 1]) {
                        rankigEdit.rules[idx + 1].min =
                          rankigEdit.rules[idx].max + 1;
                      }
                      rankigsEdit[indexRanking] = { ...rankigEdit };
                      setRankingsTournament(rankigsEdit);
                    }}
                  />
                  {
                    <Input
                      placeholder="pontuação"
                      value={data.points}
                      onChange={(event) => {
                        let rankigsEdit = [...rankingsTournament];
                        let rankigEdit = {
                          ...rankingsTournament[indexRanking],
                        };
                        rankigEdit.rules[idx].points =
                          parseInt(event.target.value) || "";
                        rankigsEdit[indexRanking] = { ...rankigEdit };
                        setRankingsTournament(rankigsEdit);
                      }}
                    />
                  }
                  {idx &&
                  idx + 1 == rankingsTournament[indexRanking]?.rules.length ? (
                    <button
                      style={{ width: 100 }}
                      onClick={() => {
                        let rankigsEdit = [...rankingsTournament];
                        let rankigEdit = {
                          ...rankingsTournament[indexRanking],
                        };
                        rankigEdit.rules.pop();
                        setRankingsTournament(rankigsEdit);
                      }}
                    >
                      <MdDelete size={20} />
                    </button>
                  ) : (
                    <div style={{ width: 100 }}></div>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => {
                let rankigsEdit = [...rankingsTournament];
                let rankigEdit = { ...rankingsTournament[indexRanking] };
                rankigEdit.rules.push({
                  min: rankigEdit.rules[rankigEdit.rules.length - 1].max + 1,
                  max: "",
                  points: "",
                });
                setRankingsTournament(rankigsEdit);
              }}
            >
              <MdAddCircle size={20} style={{ marginTop: 15 }} />
            </button>
          </ViewInput>
        </div>
      </Modal>
    </Container>
  );
};

export default CreateTournament;
