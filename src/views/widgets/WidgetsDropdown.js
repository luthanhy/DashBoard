import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilOptions } from '@coreui/icons';

const WidgetsDropdown = ({ className, onSelect, widgetsData }) => {
  const chartRefs = useRef([]);

  useEffect(() => {
    const handleColorSchemeChange = () => {
      chartRefs.current.forEach((ref, index) => {
        if (ref) {
          setTimeout(() => {
            ref.data.datasets[0].pointBackgroundColor = getStyle(`--cui-color-${widgetsData[index].color}`);
            ref.update();
          });
        }
      });
    };

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange);

    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange);
    };
  }, [widgetsData]);

  const handleWidgetSelect = (widget) => {
    if (onSelect) {
      onSelect(widget);
    }
  };

  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      {widgetsData.map((widget, index) => (
        <CCol key={index} sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color={widget.color}
            value={
              <>
                {widget.number}{' '}
                <span className="fs-6 fw-normal"></span>
              </>
            }
            title={widget.title}
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => handleWidgetSelect(widget.title)}>Action</CDropdownItem>
                  {/* ... Other DropdownItems can be added here */}
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                ref={(el) => (chartRefs.current[index] = el)}
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle(`--cui-color-${widget.color}`),
                      data: [65, 59, 84, 84, 51, 55, 40],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 30,
                      max: 89,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                      tension: 0.4,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      ))}
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func,
  widgetsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default WidgetsDropdown;
