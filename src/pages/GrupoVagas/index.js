import React, { useEffect, useState } from "react";
import { MdSearch, MdVisibility } from "react-icons/md";
import { IoMdPodium } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import api from "../../services/api";
import { Container, Cards, Card, Table, Title } from "./styles";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { getValue } from "../../services/functions";
import { Input } from "antd";

const GrupoVagas = () => {
  const navigate = useNavigate();
  const [vacancys, setVacancys] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVacancys();
  }, []);

  async function loadVacancys() {
    await api
      .get(`/group/vacancys`)
      .then((response) => {
        setVacancys(response.data);
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

  return (
    <Container>
      <Title>
        <h2>Grupos de Vagas</h2>
      </Title>
      <Cards>
        <Card>
          <div className="icon">
            <IoMdPodium color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={vacancys.length} />
            <p>Grupos de Vagas</p>
          </div>
        </Card>
      </Cards>

      <Input
        placeholder="procurar por nome"
        enterButton="Procurar"
        style={{ maxWidth: 500, marginTop: 30 }}
        size="middle"
        suffix={<MdSearch size={18} />}
        onChange={(text) => {
          setSearchName(text.target.value);
        }}
        value={searchName}
      />
      {!isLoading && (
        <>
          {vacancys.filter((data) => {
            return data.name.toLowerCase().includes(searchName.toLowerCase());
          }).length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td>Nome</td>
                    <td style={{ textAlign: "center" }}>Vagas</td>
                    <td style={{ textAlign: "center" }}>Disponiveis</td>
                    <td style={{ textAlign: "center" }}>Utilizadas</td>
                    <td style={{ textAlign: "center" }}>Valor total</td>
                    <td style={{ width: 40 }}></td>
                  </tr>
                </thead>
                <tbody>
                  {vacancys
                    .filter((data) => {
                      return data.name
                        .toLowerCase()
                        .includes(searchName.toLowerCase());
                    })
                    .map((vacancy) => (
                      <tr
                        key={vacancy.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate(`/vagas/${vacancy.name}`);
                        }}
                      >
                        <td>{vacancy.name || "Sem nome"}</td>
                        <td style={{ textAlign: "center" }}>
                          {vacancy.vacancys.length}x
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {
                            vacancy.vacancys.filter((item) => {
                              return !item.client_id;
                            }).length
                          }
                          x
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {
                            vacancy.vacancys.filter((item) => {
                              return item.rescue;
                            }).length
                          }
                          x
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {getValue(
                            vacancy.vacancys.reduce(
                              (acumulador, item) => acumulador + item.value,
                              0
                            )
                          )}
                        </td>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MdVisibility
                            style={{ marginLeft: 5 }}
                            size={22}
                            color={"#001B22"}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          ) : (
            <div className="error">
              <p>Nenhuma vaga encontrada</p>
            </div>
          )}
        </>
      )}
      {isLoading && <Loader />}
    </Container>
  );
};

export default GrupoVagas;
