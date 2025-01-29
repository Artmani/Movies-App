import { Tabs } from 'antd'

import RatedMovies from './components/RatedMovies'
import SearchMovies from './components/SearchMovies'

const items = [
  {
    key: '1',
    label: 'Search',
    children: <SearchMovies />,
  },
  {
    key: '2',
    label: 'Rated',
    children: <RatedMovies />,
  },
]

function App() {
  return <Tabs defaultActiveKey="1" centered items={items} />
}
export default App
