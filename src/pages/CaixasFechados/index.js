import React, { useEffect, useState } from "react";
import { Typography, Button, Spin } from "antd";
import { Container, CardItem, CardContent } from "./styles";
import { format } from "date-fns";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

const { Text } = Typography;

const CaixasFechados = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [financialBoxs, setFinancialBoxs] = useState([]);
  const [financialBoxsSelect, setFinancialBoxsSelect] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFinancialBoxs();
  }, []);

  async function loadFinancialBoxs() {
    setIsLoading(true);
    const url =
      user.type == "admin" ? "/club/financial-boxs" : "/financial-boxs";
    await api
      .get(url)
      .then((response) => {
        setFinancialBoxs(response.data.financialBoxs);
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
      <h2>Caixas Fechados</h2>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          {!financialBoxs.length ? (
            <div className="error">
              <p>Nenhuma caixa encontrado</p>
            </div>
          ) : (
            <>
              {user.type == "admin" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: 800,
                    alignItems: "center",
                    marginBottom: 25,
                  }}
                >
                  {!financialBoxsSelect.length ? (
                    <p>Selecione um caixa para visualizar</p>
                  ) : (
                    <p>{financialBoxsSelect.length} caixas selecionados</p>
                  )}
                  <Button
                    type="primary"
                    onClick={() => {
                      if (financialBoxsSelect.length) {
                        navigate(`/caixa?ids=${financialBoxsSelect.join(",")}`);
                      } else {
                        toast.warn("Selecione pelo menos um caixa");
                      }
                    }}
                  >
                    Visualizar Dados
                  </Button>
                </div>
              )}
            </>
          )}

          {financialBoxs.map((caixa) => (
            <CardItem
              select={financialBoxsSelect.find((data) => data == caixa.id)}
              key={caixa.id}
              onClick={() => {
                if (user.type == "admin") {
                  if (financialBoxsSelect.find((data) => data == caixa.id)) {
                    setFinancialBoxsSelect(
                      financialBoxsSelect.filter((data) => data != caixa.id)
                    );
                  } else {
                    setFinancialBoxsSelect([...financialBoxsSelect, caixa.id]);
                  }
                } else {
                  navigate(`/caixa?ids=${caixa.id}`);
                }
              }}
            >
              <CardContent>
                <Text strong>Responsável:</Text> <Text>{caixa.user.name}</Text>
              </CardContent>
              <CardContent>
                <Text strong>Data de Abertura:</Text>{" "}
                <Text>
                  {format(new Date(caixa.date_initial), "dd/MM/yyyy HH:mm")}
                </Text>
              </CardContent>
              <CardContent>
                {caixa.closed ? (
                  <>
                    <Text strong>Data de Fechamento:</Text>{" "}
                    <Text>
                      {format(new Date(caixa.date_end), "dd/MM/yyyy HH:mm")}
                    </Text>
                  </>
                ) : (
                  <Text strong>Caixa está aberto no momento</Text>
                )}
              </CardContent>
            </CardItem>
          ))}
        </>
      )}
    </Container>
  );
};

export default CaixasFechados;
