import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { routeService } from './api/service/route/RouteService';

import "./App.css"

/**
 * 1. Vite의 import.meta.glob를 사용 사용하여 page 폴더 하위의 모든 .jsx 파일을 스캔한다.
 */
const pages = import.meta.glob("./pages/**/*.jsx");

/**
 * 컴포넌트 이름에 맞는 컴포넌트를 동적으로 로딩
 * @param {string} componentName - ex) "ChatRoom", "Signup"
 */
async function loadComponent(componentName) {
  // 경로 기반 정확한 파일 매칭
  const targetPath = `./pages/${componentName}.jsx`;
  // 파일명에 컴포넌트 이름이 포함된 파일을 찾는다
  if (pages[targetPath]) {
    const module = await pages[targetPath](); // 동적 import
    return module.default;
  }

  console.error(`컴포넌트를 찾을 수 없습니다. [${targetPath}]`)
  throw new Error(`컴포넌트를 찾을 수 없습니다: ${componentName}`);
}

function App() {

  const [routeList, setRouteList] = useState([]);
  const [components, setComponents] = useState({});

  /*
   * 2. DB에서 Route 정보를 조회해서 Component와 RouteList를 생성한다.
   *    DB에서 조회한 Route의 componentName과 일치하는 항목이 있는지 조회해서 loadComponent 함수를 통해 Components에 추가한다.
   *    또한. Route 목록도 저장한다.
   */
  useEffect( () => {

    const fetchRoutes = async () => {
      try {
        // Database에서 route 목록 조회
        const response = await routeService.select();
        const routes = response.data;
        const comps = {};
  
        for (const route of routes) {
          try {
            //componentName과 일치하는 Component 항목을 찾는다.
            const comp = await loadComponent(route.componentName);
            comps[route.componentName] = comp;
          } catch (err) {
            console.error(err);
          }
        }
  
        setComponents(comps); // Components 생성
        setRouteList(routes); // Route 목록 생성
  
      } catch (error) {
        console.error("라우트 불러오기 실패:", error);
      }
    };
  
    fetchRoutes();

  }, []);

  return (
    <Router>
      <Routes>
        {/* 3. Route 목록을 Loof 돌리면서 route의 componentName에 해당하는 component를 조회한다. */}
        {routeList.length === 0 ? (
          <Route path="*" element={<div>라우트 불러오는 중...</div>} />
        ) : (
          routeList.map((route, index) => {
            const Component = components[route.componentName];
            if (!Component) return null;

            return (
              <Route
                key={index}
                path={route.path}
                element={<Component />}
              />
            );
          })
        )}
      </Routes>
    </Router>
  );
}

export default App;
