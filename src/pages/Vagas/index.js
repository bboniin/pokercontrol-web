import React, { useEffect, useState } from "react";
import { MdAdd, MdCopyAll, MdVisibility } from "react-icons/md";
import { IoMdPodium } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import CountUp from "react-countup";
import api from "../../services/api";
import { Container, Cards, Card, Table, Title, ViewInput } from "./styles";
import Loader from "../../components/Loader";
import { Pagination } from "antd";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { getValue } from "../../services/functions";

const Vagas = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [vacancys, setVacancys] = useState([]);
  const [vacancysTotal, setVacancysTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVacancys();
  }, [page]);

  async function loadVacancys() {
    await api
      .get(`/vacancys?page=${page}&name=${name}`)
      .then((response) => {
        setVacancys(response.data.vacancys);
        setVacancysTotal(response.data.vacancysTotal);
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
        <h2>Vagas - {name}</h2>
      </Title>
      <Cards>
        <Card>
          <div className="icon">
            <IoMdPodium color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={vacancysTotal} />
            <p>Vagas</p>
          </div>
        </Card>
      </Cards>
      {!isLoading && (
        <>
          {vacancys.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td>Descrição</td>
                    <td style={{ textAlign: "center" }}>Torneio</td>
                    <td style={{ textAlign: "center" }}>Cliente</td>
                    <td style={{ textAlign: "center" }}>Status</td>
                    <td style={{ textAlign: "center" }}>Valor</td>
                    <td style={{ textAlign: "center" }}>Última atualização</td>
                  </tr>
                </thead>
                <tbody>
                  {vacancys.map((vacancy) => (
                    <tr key={vacancy.id} style={{ cursor: "pointer" }}>
                      <td>{vacancy.description || "Sem descrição"}</td>
                      <td style={{ textAlign: "center" }}>
                        {vacancy.tournament.name}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {vacancy.client?.name || "Vaga disponivel"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {vacancy.clientId
                          ? "Vaga Disponivel"
                          : vacancy.rescue
                          ? `Resgatou ${format(
                              new Date(vacancy.date_rescue),
                              "dd/MM/yyyy HH:mm"
                            )}`
                          : "Pendente resgate"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {getValue(vacancy.value)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {format(
                          new Date(vacancy.date_rescue),
                          "dd/MM/yyyy HH:mm"
                        )}
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
                  total={vacancysTotal}
                  pageSize={30}
                  showTotal={(total) => `${total} vagas`}
                />
              </center>
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

export default Vagas;
