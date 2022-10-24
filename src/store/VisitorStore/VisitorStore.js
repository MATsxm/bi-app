/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { runInAction } from 'mobx';
import VisitorUtils from './VisitorUtils';

import AesirxBiApiService from 'library/Bi/Bi';
export default class VisitorStore {
  getVisitor = async (dataFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.getVisitor(dataFilter);
      if (responsedDataFromLibary) {
        const homeDataModels =
          VisitorUtils.transformPersonaResponseIntoModel(responsedDataFromLibary);

        if (homeDataModels) {
          runInAction(() => {
            callbackOnSuccess(homeDataModels);
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'No Result',
            });
          });
        }
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      console.log('errorrrr', error);
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  search = async (query) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.search({
        'filter[search]': query,
      });
      if (responsedDataFromLibary?.assets || responsedDataFromLibary?.collections) {
        const homeDataModels = VisitorUtils.transformResponseIntoSearchItems([
          ...responsedDataFromLibary?.assets,
          ...responsedDataFromLibary?.collections,
        ]);

        return homeDataModels;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
