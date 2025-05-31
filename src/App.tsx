import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Settings, Info, TrendingUp, Zap } from 'lucide-react';


interface DataPoint {
  t: number;
  x: number;
  v: number;
}

interface SolutionSeries {
  name: string;
  data: DataPoint[];
  color: string;
}


const DuffingOscillator = () => {
  const [params, setParams] = useState({
    delta: 0.1,
    alpha: 1.0,
    beta: 0.3,
    A: 0.5,
    phi: 1.0,
    x0: 1.0,
    v0: 2.0
  });
  
const [solutions, setSolutions] = useState<SolutionSeries[]>([]);
const [sensitivityData, setSensitivityData] = useState<SolutionSeries[]>([]);
  const [activeTab, setActiveTab] = useState('description');

  const rungeKutta4 = (delta: any, alpha: any, beta: any, A: any, phi: any, x0: any, v0: any, epsilon = 0) => {
    const dt = 0.01;
    const tMax = 20;
    const steps = Math.floor(tMax / dt);
    
    let x = x0 + epsilon;
    let v = v0 + epsilon;
    let t = 0;
    
    const solution = [];
    
    for (let i = 0; i <= steps; i++) {
      solution.push({ t: t, x: x, v: v });
      
      if (i < steps) {
        const k1x = v;
        const k1v = -delta * v - alpha * x - beta * Math.pow(x, 3) + A * Math.cos(phi * t);
        
        const k2x = v + 0.5 * dt * k1v;
        const k2v = -delta * (v + 0.5 * dt * k1v) - alpha * (x + 0.5 * dt * k1x) - 
                    beta * Math.pow(x + 0.5 * dt * k1x, 3) + A * Math.cos(phi * (t + 0.5 * dt));
        
        const k3x = v + 0.5 * dt * k2v;
        const k3v = -delta * (v + 0.5 * dt * k2v) - alpha * (x + 0.5 * dt * k2x) - 
                    beta * Math.pow(x + 0.5 * dt * k2x, 3) + A * Math.cos(phi * (t + 0.5 * dt));
        
        const k4x = v + dt * k3v;
        const k4v = -delta * (v + dt * k3v) - alpha * (x + dt * k3x) - 
                    beta * Math.pow(x + dt * k3x, 3) + A * Math.cos(phi * (t + dt));
        
        x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
        v += (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
        t += dt;
      }
    }
    
    return solution;
  };

  const solveDuffing = () => {
    const { delta, alpha, beta, A, phi, x0, v0 } = params;
    const solution = rungeKutta4(delta, alpha, beta, A, phi, x0, v0);
    setSolutions([{ name: 'Solução Principal', data: solution, color: '#8884d8' }]);
  };

  const analyzeSensitivity = () => {
    const { delta, alpha, beta, A, phi, x0, v0 } = params;
    const epsilons = [0, 0.01, 0.05, 0.1, 0.2];
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
    
    const newSolutions = epsilons.map((eps, idx) => ({
      name: `ε = ${eps}`,
      data: rungeKutta4(delta, alpha, beta, A, phi, x0, v0, eps),
      color: colors[idx]
    }));
    
    setSensitivityData(newSolutions);
  };

  useEffect(() => {
    solveDuffing();
  }, [params]);

  const renderChart = (data: any[], title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, yKey = 'x', yLabel = 'x(t)') => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" type="number" scale="linear" domain={['dataMin', 'dataMax']} />
          <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {data.map((series: { data: unknown; name: string | undefined; color: string | undefined; }, idx: React.Key | null | undefined) => (
            <Line 
              key={idx}
              dataKey={yKey}
              data={series.data}
              name={series.name}
              stroke={series.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderDescription = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Info className="mr-2" />
          1. Descrição do Oscilador de Duffing
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Equação Diferencial:</h3>
            <div className="bg-white p-4 rounded border font-mono text-center">
              d²x/dt² + δ(dx/dt) + αx + βx³ = A cos(φt)
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Características:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Não-linearidade:</strong> O termo βx³ torna a equação não-linear, não havendo solução analítica geral.</li>
              <li><strong>Parâmetros físicos:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>δ: coeficiente de amortecimento</li>
                  <li>α: rigidez linear da mola</li>
                  <li>β: rigidez não-linear (interpretação do comportamento da mola)</li>
                  <li>A: amplitude da força externa</li>
                  <li>φ: frequência da força externa</li>
                </ul>
              </li>
              <li><strong>Interpretação de β:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>β &gt; 0: mola "endurecedora" (rigidez aumenta com deslocamento)</li>
                  <li>β &lt; 0: mola "amolecedora" (rigidez diminui com deslocamento)</li>
                  <li>β → 0: aproxima-se do oscilador harmônico linear</li>
                </ul>
              </li>
              <li><strong>Métodos de solução:</strong> Métodos numéricos (Runge-Kutta, Euler), métodos de perturbação, análise qualitativa.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderParameterControls = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {Object.entries(params).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium mb-1">
            {key === 'delta' && 'δ (amortecimento)'}
            {key === 'alpha' && 'α (rigidez linear)'}
            {key === 'beta' && 'β (rigidez não-linear)'}
            {key === 'A' && 'A (amplitude força)'}
            {key === 'phi' && 'φ (frequência força)'}
            {key === 'x0' && 'x(0) (posição inicial)'}
            {key === 'v0' && "x'(0) (velocidade inicial)"}
          </label>
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setParams(prev => ({...prev, [key]: parseFloat(e.target.value) || 0}))}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
    </div>
  );

  const tabButtons = [
    { key: 'description', label: 'Descrição', icon: Info },
    { key: 'simulation', label: 'Simulação', icon: Play },
    { key: 'sensitivity', label: 'Sensibilidade', icon: TrendingUp },
    { key: 'chaos', label: 'Caos', icon: Zap }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Oscilador de Duffing e Sensibilidade às Condições Iniciais
      </h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tabButtons.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'description' && renderDescription()}

      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Settings className="mr-2" />
              2. Simulação Numérica
            </h2>
            
            {renderParameterControls()}
            
            <div className="grid md:grid-cols-2 gap-6">
              {renderChart(solutions, 'Posição x(t)', 'x', 'x(t)')}
              {renderChart(solutions, "Velocidade x'(t)", 'v', "x'(t)")}
            </div>
            
            <div className="bg-white p-4 rounded border mt-4">
              <h3 className="font-semibold mb-2">3. Análise para β pequeno:</h3>
              <p>Quando β → 0, o oscilador de Duffing aproxima-se do oscilador harmônico amortecido forçado linear. 
              O comportamento torna-se mais previsível e periódico, perdendo as características caóticas típicas do sistema não-linear.</p>
              <p className="mt-2"><em>Experimente: diminua β para valores próximos de 0 e observe como as oscilações se tornam mais regulares.</em></p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sensitivity' && (
        <div className="space-y-6">
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="mr-2" />
              4. Análise de Sensibilidade às Condições Iniciais
            </h2>
            
            <button 
              onClick={analyzeSensitivity}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Analisar Sensibilidade
            </button>
            
            <p className="mb-4">
              Condições iniciais: x(0) = {params.x0} + ε, x'(0) = {params.v0} + ε
            </p>
            
            {sensitivityData.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {renderChart(sensitivityData, 'Comparação de Trajetórias x(t)', 'x', 'x(t)')}
                {renderChart(sensitivityData, "Comparação de Velocidades x'(t)", 'v', "x'(t)")}
              </div>
            )}
            
            <div className="bg-white p-4 rounded border mt-4">
              <h3 className="font-semibold mb-2">Observações:</h3>
              <p>Para certos valores de parâmetros, pequenas mudanças nas condições iniciais (ε pequeno) 
              podem levar a trajetórias completamente diferentes após algum tempo. Isso é característico 
              da <strong>sensibilidade às condições iniciais</strong>.</p>
              <p className="mt-2"><em>Experimente diferentes valores de parâmetros para observar quando essa sensibilidade é mais pronunciada.</em></p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chaos' && (
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Zap className="mr-2" />
              5. Sensibilidade às Condições Iniciais e Caos
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Sensibilidade às Condições Iniciais:</h3>
                <p className="mb-2">
                  É a propriedade de um sistema dinâmico onde pequenas mudanças nas condições iniciais 
                  resultam em diferenças drasticamente grandes nos resultados após um período de tempo. 
                  Matematicamente, isso significa que a distância entre duas trajetórias que começam 
                  próximas cresce exponencialmente com o tempo.
                </p>
                <div className="bg-white p-3 rounded border">
                  <strong>No Oscilador de Duffing:</strong> Sim, apresenta sensibilidade às condições iniciais, 
                  especialmente quando os parâmetros estão em regimes caóticos. Isso ocorre devido à não-linearidade 
                  introduzida pelo termo βx³, que pode amplificar pequenas diferenças iniciais.
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Conceito de Caos:</h3>
                <div className="space-y-3">
                  <p>
                    <strong>Caos determinístico</strong> é um comportamento aparentemente aleatório que surge 
                    de sistemas determinísticos não-lineares. Principais características:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Sensibilidade às condições iniciais</strong> (efeito borboleta)</li>
                    <li><strong>Comportamento aperiódico</strong> (não se repete exatamente)</li>
                    <li><strong>Determinismo</strong> (governado por equações precisas)</li>
                    <li><strong>Estrutura fractal</strong> no espaço de fases</li>
                  </ul>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2">Interpretação Física no Oscilador de Duffing:</h4>
                    <p>
                      O caos surge da competição entre a força restauradora não-linear (βx³), 
                      o amortecimento (δ dx/dt) e a força externa periódica (A cos(φt)). 
                      Dependendo dos valores dos parâmetros, o sistema pode exibir:
                    </p>
                    <ul className="list-disc list-inside mt-2 ml-4">
                      <li>Movimento periódico simples</li>
                      <li>Movimento quase-periódico</li>
                      <li>Comportamento caótico</li>
                      <li>Múltiplos atratores coexistentes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-100 p-4 rounded border">
                    <h4 className="font-semibold mb-2">Relevância Prática:</h4>
                    <p>
                      O estudo do caos no oscilador de Duffing tem aplicações em engenharia mecânica, 
                      eletrônica, e sistemas biológicos, ajudando a entender quando sistemas reais 
                      podem se tornar impredizíveis apesar de serem governados por leis determinísticas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuffingOscillator;