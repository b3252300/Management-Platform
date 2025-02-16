import { defineStore } from 'pinia'
import cookies from '@/utils/cookies'
import { TOKEN, AVATAR } from '@/config/constant'
import { logout } from '@/api/user'
import { resetRouter } from '@/router'
import useTagsViewStore from './tagsView'

const usePatientStore = defineStore({
  id: 'patients',
  state: () => {
    return {
      patientId: cookies.get("PatientData") == undefined ? '' : JSON.parse(cookies.get("PatientData")).patientId,
      patientRowId: cookies.get("PatientData") == undefined ? '' : JSON.parse(cookies.get("PatientData")).patientRowId,
      patientName: cookies.get("PatientData") == undefined ? '' : JSON.parse(cookies.get("PatientData")).patientName,
      patientSex: cookies.get("PatientData") == undefined ? '' : JSON.parse(cookies.get("PatientData")).patientSex,
      DateOfBirth: cookies.get("PatientData") == undefined ? '' : JSON.parse(cookies.get("PatientData")).DateOfBirth,
      AdmissionDate: cookies.get("PatientData") == undefined ? '' : JSON.parse(cookies.get("PatientData")).AdmissionDate,
      BedCode: cookies.get("PatientData") == undefined ? '' : JSON.parse(cookies.get("PatientData")).BedCode,
      BedName: cookies.get("PatientData") == undefined ? '' : JSON.parse(cookies.get("PatientData")).BedName,
    }
  },
  actions: {
    SET_PATIENT(data) {
      data ? cookies.set("PatientData", JSON.stringify(data)) : cookies.remove("PatientData")
      this.BedCode = data.BedCode;
      this.BedName = data.BedName;
      this.patientName = data.patientName;
      this.patientId = data.patientId;
      this.patientRowId = data.patientRowId;
      this.patientSex = data.patientSex;
      this.DateOfBirth = data.DateOfBirth;
      this.AdmissionDate = data.AdmissionDate;
    },
    REMOVE_PATIENT(){
      cookies.remove("PatientData");
    },
  }
})
export default usePatientStore;
