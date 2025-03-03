import { env } from 'aesirx-lib';
import { RingLoaderComponent } from 'aesirx-uikit';
import ComponentNoData from '../ComponentNoData';
import Table from '../Table';
import PAGE_STATUS from '../../constants/PageStatus';
import React from 'react';
import { withTranslation } from 'react-i18next';
const BehaviorTable = ({
  data: { header = [], data = [] },
  pagination,
  handleFilterTable,
  statusTable,
  t,
  isPaginationAPI = false,
  isTranslate = false,
}) => {
  const columnsTable = React.useMemo(
    () =>
      header.map((item, index) => ({
        ...item,
        className: `px-3 py-16 fs-sm fw-semibold border-bottom border-gray-800 align-middle ${
          index + 1 === header.length ? 'rounded-top-end-3' : ''
        } ${index === 0 ? 'rounded-top-start-3' : ''}`,
        width: 100,

        ...(isTranslate
          ? {
              Header: (
                <span className="align-middle text-gray-900 fw-medium">{t(item.Header)}</span>
              ),
            }
          : {}),
      })),
    [header]
  );
  const dataTable = React.useMemo(() => data, [data]);
  return (
    <div className="h-100 ChartWrapper position-relative">
      {statusTable === PAGE_STATUS.LOADING ? (
        <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
      ) : data ? (
        <Table
          classNameTable={'mb-0'}
          columns={columnsTable}
          data={dataTable}
          canSort={true}
          pagination={true}
          paginationClass={'fs-14 px-4'}
          isPaginationAPI={isPaginationAPI}
          paginationResponse={pagination}
          selectPage={async (value) => {
            await handleFilterTable({ page: value });
          }}
          selectPageSize={async (value) => {
            await handleFilterTable({
              page: 1,
              page_size: value,
            });
          }}
        />
      ) : (
        <div className="position-relative ChartWrapper bg-white rounded-3 shadow-sm">
          <div className="position-absolute top-50 start-50 translate-middle">
            <ComponentNoData
              icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
              title={t('txt_no_data')}
              width="w-50"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default withTranslation()(BehaviorTable);
