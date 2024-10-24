import React, { useState, useEffect } from 'react';
import {
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CFormSelect, CCard, CCardBody, CCardHeader, CRow, CCol, CFormLabel, CButton
} from '@coreui/react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import WidgetsDropdown from '../widgets/WidgetsDropdown';
import axios from 'axios';

const Dashboard = () => {
  const [responseData, setResponseData] = useState([]);
  const [selectedServer, setSelectedServer] = useState("s04-simpia-solo-gen-2024-09-26");
  const [selectedDate, setSelectedDate] = useState("today");

  // Tạo hàm để fetch dữ liệu từ server
  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:4000/getDataServiceProxy', {
        selectedDate // Gửi selectedDate để server có thể trả về dữ liệu tương ứng
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setResponseData(response.data); // Cập nhật responseData bằng dữ liệu từ server
    } catch (e) {
      console.error("Axios error:", e);
    }
  };

  // Gọi fetchData khi component mount hoặc khi selectedDate thay đổi
  useEffect(() => {
    fetchData();
  }, [selectedDate]); // Thêm selectedDate vào dependency array

  const handleServerChange = (e) => {
    setSelectedServer(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const renderData = () => {
    const selectedData = responseData?.data?.[1]?.proxyResults?.find(server => server.nameServer === selectedServer);

    // Lấy dữ liệu dựa trên tùy chọn đã chọn
    const data = selectedData
      ? selectedDate === "today"
        ? selectedData.proxyServerToday
        : selectedDate === "7days"
          ? selectedData.proxyServer7Days
          : selectedDate === "30days"
            ? selectedData.proxyServer30Days
            : selectedData.proxyServerAllTime
      : [];

    const valueNames = [
      "Pick Proxy Time", // Value 9
      "Download Time", // Value 10
      "Vocal Separation Time", // Value 11
      "Mixer Chords", // Value 12
      "Generation Time", // Value 13
      "Total Time" // Value 14
    ];

    return (
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Metric</CTableHeaderCell>
            <CTableHeaderCell>Time Agv</CTableHeaderCell>
            <CTableHeaderCell>Count Success</CTableHeaderCell>
            <CTableHeaderCell>Count Fail</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.length > 0 && (
            <>
              <CTableRow>
                <CTableDataCell>{valueNames[0]}</CTableDataCell>
                <CTableDataCell>{data[8]}</CTableDataCell>
                <CTableDataCell></CTableDataCell> {/* Count Success */}
                <CTableDataCell></CTableDataCell> {/* Count Fail */}
              </CTableRow>
              <CTableRow>
                <CTableDataCell>{valueNames[1]}</CTableDataCell>
                <CTableDataCell>{data[9]}</CTableDataCell>
                <CTableDataCell>{data[0]}</CTableDataCell> {/* Count Success */}
                <CTableDataCell>{data[1]}</CTableDataCell> {/* Count Fail */}
              </CTableRow>
              <CTableRow>
                <CTableDataCell>{valueNames[2]}</CTableDataCell>
                <CTableDataCell>{data[10]}</CTableDataCell>
                <CTableDataCell>{data[2]}</CTableDataCell> {/* Count Success */}
                <CTableDataCell>{data[3]}</CTableDataCell> {/* Count Fail */}
              </CTableRow>
              <CTableRow>
                <CTableDataCell>{valueNames[3]}</CTableDataCell>
                <CTableDataCell>{data[11]}</CTableDataCell>
                <CTableDataCell>{data[6]}</CTableDataCell> {/* Count Success */}
                <CTableDataCell>{data[7]}</CTableDataCell> {/* Count Fail */}
              </CTableRow>
              <CTableRow>
                <CTableDataCell>{valueNames[4]}</CTableDataCell>
                <CTableDataCell>{data[12]}</CTableDataCell>
                <CTableDataCell>{data[4]}</CTableDataCell> {/* Count Success */}
                <CTableDataCell>{data[5]}</CTableDataCell> {/* Count Fail */}
              </CTableRow>
              <CTableRow>
                <CTableDataCell>{valueNames[5]}</CTableDataCell>
                <CTableDataCell>{data[13]}</CTableDataCell>
                <CTableDataCell></CTableDataCell> {/* Count Success */}
                <CTableDataCell></CTableDataCell> {/* Hoặc điều chỉnh theo logic của bạn */}
              </CTableRow>
            </>
          )}
        </CTableBody>
      </CTable>
    );
  };
  const Dashboard = () => {
    const widgetsData = [
      { title: 'Số lượng Proxy active', number: responseData?.data?.[0]?.totalProxySuccess, color: 'primary' },
      { title: 'Số lượng Proxy Test Fail', number: responseData?.data?.[0]?.totalProxyLocked, color: 'success' },
      { title: 'Số lượng Proxy bị khóa', number: responseData?.data?.[0]?.totalProxyTestFailed, color: 'info' },
      { title: 'Số lượng Song Request', number: responseData?.data?.[0]?.totalSong, color: 'warning' },
    ];

    return (
      <WidgetsDropdown className="mb-4" widgetsData={widgetsData} />
    );
  };

  const totalNoUsing = responseData?.data?.[0]?.totalSongNoUsing || 0;
  const totalUsed = responseData?.data?.[0]?.totalSongUse || 0;

  const totalSongs = totalNoUsing + totalUsed;
  const perFail = totalSongs > 0
    ? Math.round((totalNoUsing / totalSongs) * 100)
    : 0;

  const pieData = [
    { name: 'Số lượng bài down Fail', value: perFail },
    { name: 'Số lượng bài down Success', value: 100 - perFail },
    ];

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28'];

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <CRow className="mb-4">
          <CCol xs="12" sm="6" md="4">
            <CFormLabel>Chọn Server:</CFormLabel>
            <CFormSelect value={selectedServer} onChange={handleServerChange}>
              {responseData?.data?.[1]?.proxyResults?.map(server => (
                <option key={server.nameServer} value={server.nameServer}>
                  {server.nameServer}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol xs="12" sm="6" md="4">
            <CFormLabel>Chọn Ngày:</CFormLabel>
            <CFormSelect value={selectedDate} onChange={handleDateChange}>
              <option value="today">Hôm nay</option>
              <option value="7days">7 Ngày</option>
              <option value="30days">30 Ngày</option>
              <option value="allTime">Tất cả thời gian</option>
            </CFormSelect>
          </CCol>

          <CCol xs="12" sm="6" md="4" className="d-flex align-items-end">
            <CButton color="primary" onClick={() => alert(`Selected Server: ${selectedServer}, Date: ${selectedDate}`)}>
              Xem Dữ Liệu
            </CButton>
          </CCol>
        </CRow>

        <div>
          <h2>Dữ liệu cho Server {selectedServer}:</h2>
          {renderData()}
        </div>
      </div>

      <CRow className="d-flex justify-content-center">
        <CCol xs="12" sm="12" md="12">
          <CCard className="mb-4">
            <CCardHeader>
            </CCardHeader>
            <CCardBody className="d-flex justify-content-center">
              <PieChart width={800} height={400}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={150}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <Dashboard></Dashboard>

    </>
  );
}

export default Dashboard;
