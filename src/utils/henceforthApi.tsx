// import { workload } from '@/assets/images/workload.png';

import React from "react";
import _superagent, { search } from "superagent";
const SuperagentPromise = require("superagent-promise");
const superagent = SuperagentPromise(_superagent, global.Promise);

export const API_ROOT = "https://dial-ai.henceforthsolutions.com:3001/";
export const BUCKET_ROOT = "https://raizestag.blob.core.windows.net";


// export const API_ROOT = "https://production.techraize.com:3000/";
// export const BUCKET_ROOT = "https://raizeprod.blob.core.windows.net";

const API_FILE_ROOT_MEDIUM = `${BUCKET_ROOT}/medium/`;
const API_FILE_ROOT_ORIGINAL = `${BUCKET_ROOT}/original/`;
const API_FILE_ROOT_SMALL = `${BUCKET_ROOT}/small/`;
const API_FILE_ROOT_AUDIO = `${BUCKET_ROOT}/audio/`;
const API_FILE_ROOT_VIDEO = `${BUCKET_ROOT}/video/`;
const API_FILE_ROOT_DOCUMENTS = `${BUCKET_ROOT}/documents/`;
const API_FILE_ROOT_DB_BACKUP = `${BUCKET_ROOT}/backup/`;
const API_FILE_ROOT_DOCS = `${BUCKET_ROOT}/docs/`;

const encode = encodeURIComponent;
const responseBody = (res: any) => res.body;

let token: any = null;
const tokenPlugin = (req: any) => {
  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }
};

const requests = {
  del: (url: string) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  delMultiple: (url: string, body: any) =>
    superagent
      .del(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  get: (url: string) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url: string, body: any) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  patch: (url: string, body: any) =>
    superagent
      .patch(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url: string, body: any) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  file: (url: string, key: string, file: any) =>
    superagent
      .post(`${API_ROOT}${url}`)
      .attach(key, file)
      .use(tokenPlugin)
      .then(responseBody),
};
const Department = {
  add: (info: any) => requests.post("departments", info),
  delete: (id: string) => requests.del(`departments/${id}`),
  edit: (info: any, id: string) => requests.patch(`departments/${id}`, info),
  request: (info: any) => requests.post("departments/request", info),
  listing: (type?: any) => requests.get(type ? `departments?${type}` : `departments`),
  signUp: (info: any) => requests.post("user/signUp", info),
  selectCompanyDepartment: (id: string, info: any) =>
    requests.patch(`departments/company-admin-department/${id}`, info),
  requestpatch: (id: string, info: any) => requests.patch(`departments/request/${id}`, info)
};

const Alert_Activity = {
  add: (info: any) => requests.post("departments", info),
  request: (info: any) => requests.post("departments/request", info),
  listing: (type?: any) => requests.get(type ? `alert-activity?${type}` : `alert-activity`),
  markread: (id?: string, info?: any) =>
    requests.patch(`notification/read`, info),
  deleteAlert: (id?: string, info?: any) =>
    requests.patch(`alert/${id}`, info),
}

const Comment = {
  add: (id: string, info: any) => requests.post(`process/comment/${id}`, info),
  listing: (id: string) => requests.get(`process/comment/${id}`),
  update: (id: string, info: any) =>
    requests.patch(`process/comment/${id}`, info),
  doNothing: (id: string, info: any) =>
    requests.patch(`process/comment/do-nothing/${id}`, info),
  delete: (id: string) => requests.del(`process/comment/${id}`),
};

const page = {
  add: (info: any) => requests.post(`admin/pages`, info),
  listing: (q: string) => requests.get(`admin/pages?type=${q}`),
  update: (id: string, info: any) =>
    requests.patch(`admin/pages/${id}`, info),
  doNothing: (id: string, info: any) =>
    requests.patch(`process/comment/do-nothing/${id}`, info),
  delete: (id: string) => requests.del(`process/comment/${id}`),
};

const SuperAdmin = {
  login: (info: any) => requests.post("admin/login", info),
  setupCompProfile: (info: any) => requests.post("admin/company", info),
  getSystems:(search?:any)=>requests.get(search?`system?search=${search}`:"system?limit=200"),
  changePassword: (info: any) => requests.put("admin/password", info),
  profile: (type?: any) => requests.get(type ? `admin/profile?${type}` : `admin/profile`),
  updateProfile: (info: any) => requests.put("admin/profile", info),
  callListing: (q: any) => requests.get(`admin/call${q ? `?${q}` : ""}`),
  dashboardCards: (type?:any) => requests.get(type?`admin/dashboard?type=${type}`:"admin/dashboard"),
  getTranscription: (id: string) => requests.get(`admin/call/${id}/transcript`),
  callDetail: (id: string) => requests.get(`admin/call/${id}`),
  submitPhoneNumber:(info:any)=>requests.post(`twilio/send-call-admin`,info),
  sendMessage:(info:any)=>requests.post(`chat`,info),
  submitChatProfile:(id:any,info:any)=>requests.put(`chat/${id}/user-detail`,info),
  endChat:(id:any)=>requests.put(`chat/${id}`,{}),
};
const Company = {
  add: (info: any) => requests.post("admin/company", info),
  profile: () => requests.get("admin/profile-chatboat"),
  updateCompany: (id: string, info: any) =>
    requests.patch(`admin/company/${id}`, info),
  addmember: (id: string, info: any) =>
    requests.post(`admin/company/${id}/admins`, info),
};
const Team = {
  addTeamMates: (info: any) => requests.post("user/teammates", info),
  deleteDeactivate: (info: any) =>
    requests.patch(`user/teammates/delete/deactivate`, info),
  add: (info: any) => requests.post("admin/team", info),
  profile: () => requests.get("admin/company"),
  updateCompany: (id: string, info: any) =>
    requests.patch(`admin/company/${id}`, info),
  addTeamMember: (info: any) => requests.post(`user/team-admin`, info),
  editTeamMember: (info: any, id: string) => requests.patch(`user/teammates/access/profile/${id}`, info),
  teammatesList: (q?: any) => requests.get(`user/teammates${q ? `?${q}` : ""}`),
  teamMateDetails: (id: any) => requests.get(`user/teammates/${id}`),
  deleteArchiev: (id: any, info: any) => requests.patch(`user/teammate/process/${id}`, info)

};

const Systems={
  get:(q?: any) => requests.get(`system${q ? `?${q}` : ""}`),
  create:(info:any)=>requests.post("system",info),
  update:(id:string,info:any)=>requests.patch(`system/${id}`,info),
  delete:(id:string)=>requests.del(`system/${id}`),
  getOne:(id:string)=>requests.get(`system/${id}`)
}
const Auth = {
  login: (info: any) => requests.post("user/login", info),
  signUp: (info: any) => requests.post("user/signUp", info),
  socialLogin: (info: any) => requests.post("login", info),
  addDoc: (info: any) => requests.post("user/ids", info),
  editDoc: (id: string, info: any) => requests.put(`user/ids/${id}`, info),
  getDoc: () => requests.get(`user/ids`),
  checkEmail: (value: string) =>
    requests.get(`user/email/exist?email=${value}`),
  delDoc: (id: string) => requests.del(`user/ids/${id}`),
  logout: () => requests.put("user/logout", {}),
  changePassword: (info: any) => requests.put("admin/change-password", info),
  profile: () => requests.get(`user/profile`),
  forgotPassword: (value: any) => requests.put("user/forget/password", value),
  resendOtp: (value: any) => requests.post("user/resend/email/otp", value),
  resendOtpPhone: (value: any) => requests.put("user/resend/phone/otp", value),
  verifyOtp: (info: any) => requests.post("user/otp/verify", info),
  verifyEmail: (info: any) => requests.post("user/verify/email", info),
  verifyPhone: (info: any) => requests.post("user/verify/phone", info),
  resetPassword: (info: any) => requests.put("user/reset/password", info),
  edit: (info: any) => requests.put("user/profile", info),
};

const Common = {
  uploadFile: (key: string, file: any) =>
    requests.file(`uploads/file`, key, file),
  uploadFileMultiple: (key: string, file: any) =>
    requests.file(`Upload/do_spaces_file_upload_multiple`, key, file),
  dbBackup: () => requests.post(`admin/dbbackup/v1`, {}),
  listing: (q?: string) => requests.get(`user/homepage${q ? "?" + q : ""}`),
};
const Chat = {
  question: (info: any) => requests.post("chat", info),
  list: (q?: any) => requests.get(`chat${q ? `?${q}` : ""}`),
  del: (id: string) => requests.del(`chat/${id}`),
  delMultiple: (q: any) => requests.del(`chat${q ? `?${q}` : ""}`),

};
const User = {
  dashboard: (q?: any) => requests.get(`user/dashbord${q ? `?${q}` : ""}`),
  workload: (q: any) => requests.get(`user/work-load?type=${q}`),
  organization: (type: any) => requests.get(`user/organization?type=${type}`),
  teammatesDetails: (id: string) => requests.get(`user/teammates/${id}`),
  notificationList: (type: string) => requests.get(`admin/notifications/settings?type=${type}`),
  notificationListUpdate: (info: any) => requests.patch("admin/notifications/settings", info),
  previlege: (info: any) => requests.get(`user/previlege?${info}`),
  update: (id: string, info: any) => requests.patch(`user/teammates/access/profile/${id}`, info),
  alertAccept: (id: string, info: any) => requests.patch(`user/alert/accept/reject/${id}`, info),
  scheduleUpdate: (id: string, info: any) => requests.patch(`user/schedule/accept-reject/${id}`, info),
};

const Demo = {
  createProcess: (info: any) => requests.post("defaut/process", info),
  createContent: (info: any) => requests.post("defaut/image", info),
  updateContent: (id: string, info: any) =>
    requests.put(`defaut/process/${id}`, info),
  processList: () => requests.get(`defaut/process`),
  getContent: (id: string) => requests.get(`defaut/image?_id=${id}`),
  getContentAll: (id: string) => requests.get(`defaut/process/${id}`),
  updateVideoContent: (id: string, info: any) =>
    requests.patch(`defaut/process/${id}`, info),
};
const Process = {
  generateAI: (id: any, info: any) => requests.post(`process/genrate-description/${id}`, info),
  create: (info: any) => requests.post("process", info),
  getById: (id: string) => requests.get(`process/${id}`),
  delete: (id: string) => requests.del(`process/delete/${id}`),
  deleteMultiple: (items: any) => requests.patch(`process/bulk/delete/archive`, items),
  flowChartUpdate: (id: any, payload: any) =>
    requests.patch(`process/update_flowchart/${id}`, payload),
  updateProcessAfterCreate: (id: string, info: any) =>
    requests.patch(`process/${id}`, info),
  processUpdate: (id: string, info: any) =>
    requests.patch(`process/details/${id}`, info),
  editProcess:(id:string,info:any)=>requests.patch(`process/${id}`,info)
  ,
  archieved: (id: string, info: any) =>
    requests.patch(`process/archive/${id}`, info),
  assign: (info: any) =>
    requests.patch(`process/assign`, info),
  assignProcess: (id: any, info: any) => requests.post(`user/teammates/assign/processess/${id}`, info),
  processComplete: (id: string, info: any) =>
    requests.patch(`process/complete/${id}`, info),
  processUploadVideo: (id: string, info: any) =>
    requests.patch(`process/add-video-audio/${id}`, info),
  createContent: (info: any) => requests.post("defaut/image", info),
  download: (info: any) => requests.post("process/download", info),
  updateContent: (id: string, info: any) =>
    requests.put(`defaut/process/${id}`, info),
  userList: (type: string) => requests.get(`user/teammates?filter=${type}`),
  userListSearch: (q: any) => requests.get(`user/teammates${q ? `?${q}` : ""}`),
  processList: (q?: any) => requests.get(`process${q ? `?${q}` : ""}`),
  getContent: (id: string) => requests.get(`defaut/image?_id=${id}`),
  getContentAll: (id: string) => requests.get(`defaut/process/${id}`),
  activity: (id: string) =>
    requests.get(`process/activities
/${id}`),
  updateVideoContent: (id: string, info: any) =>
    requests.patch(`defaut/process/${id}`, info),
  importexport: (q: string) =>
    requests.get(`process/import-export?${q}`),
  getTriggers:()=>requests.get(`user/processes/names`),
  shareInternalUsers:()=>requests.get(`user/internal-external?type=INTERNAL`),
  shareExternalUsers:()=>requests.get(`user/internal-external?type=EXTERNAL`)
};
const FILES = {
  audio: (filename: string) =>
    filename?.startsWith("http")
      ? filename
      : `${API_FILE_ROOT_AUDIO}${filename}`,
  video: (filename: string) =>
    filename?.startsWith("http")
      ? filename
      : `${API_FILE_ROOT_VIDEO}${filename}`,
  imageOriginal: (filename: string, alt: any) =>
    filename
      ? filename?.startsWith("http")
        ? filename
        : `${API_FILE_ROOT_ORIGINAL}${filename}`
      : alt,
  imageMedium: (filename: string, alt: any) =>
    filename
      ? filename?.startsWith("http")
        ? filename
        : `${API_FILE_ROOT_MEDIUM}${filename}`
      : alt,
  imageSmall: (filename: string, alt?: any) =>
    filename
      ? filename?.startsWith("http")
        ? filename
        : `${API_FILE_ROOT_SMALL}${filename}`
      : alt,

      document:(filename: string, alt?: any) =>
        filename
          ? filename?.startsWith("http")
            ? filename
            : `${API_FILE_ROOT_DOCUMENTS}${filename}`
          : alt,
};

const henceforthApi = {
  Auth,
  Demo,
  Process,
  Company,
  Comment,
  Alert_Activity,
  page,
  User,
  Team,
  Chat,
  Department,
  API_ROOT,
  API_FILE_ROOT_DB_BACKUP,
  API_FILE_ROOT_SMALL,
  API_FILE_ROOT_MEDIUM,
  API_FILE_ROOT_DOCS,
  API_FILE_ROOT_ORIGINAL,
  API_FILE_ROOT_VIDEO,
  API_FILE_ROOT_DOCUMENTS,
  SuperAdmin,
  Common,
  BUCKET_ROOT,
  FILES,
  token,
  Systems,
  encode,
  setToken: (_token?: string) => {
    token = _token;
  },
};

export default henceforthApi;