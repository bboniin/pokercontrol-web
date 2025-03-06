import React, { useEffect, useState } from "react";
import { MdAdd, MdCopyAll, MdVisibility } from "react-icons/md";
import { IoMdTrophy } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import api from "../../services/api";
import { Container, Cards, Card, Table, Title } from "./styles";
import Loader from "../../components/Loader";
import { Button, Pagination } from "antd";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Tournaments = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [tournamentsTotal, setTournamentsTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, [page]);

  const status = {
    aberto: "Aberto",
    criado: "Criado",
    final: "Em Andamento",
    inscricao: "Em Andamento",
    encerrado: "Encerrado",
  };

  async function loadTournaments() {
    await api
      .get(`/tournaments?page=${page}`)
      .then((response) => {
        setTournaments(response.data.tournaments);
        setTournamentsTotal(response.data.tournamentsTotal);
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
        <h2>Torneios</h2>
        <div>
          <Button
            type="primary"
            onClick={() => {
              navigate("/novo-torneio");
            }}
          >
            <MdAdd size="20" color="#fff" />
            <span>Novo Torneio</span>
          </Button>
        </div>
      </Title>
      <Cards>
        <Card>
          <div className="icon">
            <IoMdTrophy color="#848484" size={32} />
          </div>
          <div className="number">
            <CountUp duration={1} end={tournamentsTotal} />
            <p>Torneios</p>
          </div>
        </Card>
      </Cards>
      {!isLoading && (
        <>
          {tournaments.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <td>Torneio</td>
                    <td style={{ textAlign: "center" }}>Data</td>
                    <td style={{ textAlign: "center" }}>Status</td>
                    <td style={{ width: 40 }}></td>
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map((tournamet) => (
                    <tr key={tournamet.id} style={{ cursor: "pointer" }}>
                      <td
                        onClick={() => {
                          navigate(`/torneio/${tournamet.id}`);
                        }}
                      >
                        {tournamet.name}
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/torneio/${tournamet.id}`);
                        }}
                        style={{ textAlign: "center" }}
                      >
                        {format(
                          new Date(tournamet.create_at),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </td>
                      <td
                        onClick={() => {
                          navigate(`/torneio/${tournamet.id}`);
                        }}
                        style={{ textAlign: "center" }}
                      >
                        {status[tournamet.status]}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdVisibility
                          onClick={() => {
                            navigate(`/torneio/${tournamet.id}`);
                          }}
                          style={{ marginLeft: 5 }}
                          size={22}
                          color={"#001B22"}
                        />
                        <MdCopyAll
                          onClick={() => {
                            navigate(`/novo-torneio?copy=${tournamet.id}`);
                          }}
                          style={{ marginLeft: 5 }}
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
                  total={tournamentsTotal}
                  pageSize={30}
                  showTotal={(total) => `${total} torneios`}
                />
              </center>
            </>
          ) : (
            <div className="error">
              <p>Nenhum torneio encontrado</p>
            </div>
          )}
        </>
      )}

      {isLoading && <Loader />}
    </Container>
  );
};

export default Tournaments;
