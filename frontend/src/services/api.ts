import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const downloadInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000, // Longer timeout for file downloads
  responseType: 'blob',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response.config?.responseType === 'blob' || response.request?.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob'
    });
    
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

export const downloadManuscriptFile = async (manuscriptId: string, filename?: string) => {
  const rawApi: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  try {
    try {
      const jsonResponse = await rawApi.get(`/manuscripts/${manuscriptId}/download`, {
        responseType: 'json'
      });
      
      if (jsonResponse.data?.success && jsonResponse.data?.downloadUrl) {
        const fileResponse = await fetch(jsonResponse.data.downloadUrl);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch file from Cloudinary: ${fileResponse.statusText}`);
        }
        const blob = await fileResponse.blob();
        
        if (!blob.type.includes('pdf') && !blob.type.includes('octet-stream') && blob.type !== 'application/pdf') {
          console.warn('Downloaded file type:', blob.type, '- proceeding anyway');
        }
        
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename || `manuscript-${manuscriptId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        return true;
      }
      
      if (jsonResponse.data?.success === false) {
        throw new Error(jsonResponse.data?.message || 'Download failed');
      }
      
        throw new Error('Invalid response format - no downloadUrl found');
    } catch (jsonError: any) {
      if (jsonError.response?.status === 404) {
        throw new Error('Manuscript not found');
      }
      
      if (jsonError.code === 'ERR_NETWORK' || jsonError.message?.includes('JSON') || !jsonError.response) {
        const blobResponse = await rawApi.get(`/manuscripts/${manuscriptId}/download`, {
          responseType: 'blob'
        });
        
        if (blobResponse.data instanceof Blob) {
          const blob = blobResponse.data;
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', filename || `manuscript-${manuscriptId}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
          return true;
        }
      }
      
      throw jsonError;
    }
  } catch (error: any) {
    console.error('Download failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      dataType: typeof error.response?.data,
      isBlob: error.response?.data instanceof Blob
    });
    
    if (error.response?.data) {
      try {
        let errorData = error.response.data;
        
        if (typeof errorData === 'string') {
          try {
            errorData = JSON.parse(errorData);
          } catch (e) {
          }
        }
        
        if (errorData instanceof Blob) {
          const blob = errorData;
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', filename || `manuscript-${manuscriptId}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
          return true;
        }
        
        if (errorData?.downloadUrl) {
          const link = document.createElement('a');
          link.href = errorData.downloadUrl;
          link.setAttribute('download', filename || `manuscript-${manuscriptId}.pdf`);
          link.setAttribute('target', '_blank');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return true;
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
    }
    
    throw error;
  }
};
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  getOrcidLinkUrl: () => api.get('/auth/orcid/link-url')
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  assignReviewer: (payload) => api.post('/admin/assign-reviewer', payload),
  updateUserRoles: (payload) => api.patch('/admin/user-roles', payload),
  getPendingManuscripts: () => api.get('/admin/pending-manuscripts'),
  setManuscriptStatus: (id: string, status: string) =>
    api.patch(`/admin/manuscripts/${id}/status`, { status }),
  getPayments: () => api.get('/admin/payments')
};

export const manuscriptAPI = {
  submitManuscript: (formData) => {
    return api.post('/manuscripts/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getMyManuscripts: () => api.get('/manuscripts/my-manuscripts'),

  getManuscript: (id) => api.get(`/manuscripts/${id}`),

  downloadManuscript: (id) => {
    return api.get(`/manuscripts/${id}/download`, {
      responseType: 'blob'
    });
  },

  submitRevision: (manuscriptId: string, formData) => {
    return api.post(`/manuscripts/${manuscriptId}/submit-revision`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};

export const paymentAPI = {
  createOrder: (manuscriptId: string) => api.post('/payments/create-order', { manuscriptId }),
  verifyPayment: (payload: any) => api.post('/payments/verify', payload)
};

export const queriesAPI = {
  submitQuery: (payload: { name: string; email: string; message: string }) => api.post('/queries', payload),
  getPending: () => api.get('/queries/pending'),
  getUserQueries: () => api.get('/queries/my-queries'),
  replyQuery: (id: string, reply: string) => api.post(`/queries/${id}/reply`, { reply })
};

interface ReviewFormData {
  scores: {
    originality: number;
    methodology: number;
    contribution: number;
    clarity: number;
    references: number;
  };
  commentsToAuthor: string;
  commentsToEditor?: string;
  confidentialComments?: string;
  recommendation: 'accept' | 'minor_revisions' | 'major_revisions' | 'reject';
}

export const reviewerAPI = {
  getStatistics: () => api.get('/reviews/statistics'),

  getMyReviews: (params?: { status?: string; page?: number; limit?: number }) => {
    return api.get('/reviews/my-reviews', { params });
  },

  getReviewDetails: (reviewId: string) => api.get(`/reviews/${reviewId}`),

  getManuscriptForReview: (manuscriptId: string) => 
    api.get(`/reviews/manuscript/${manuscriptId}/for-review`),

  acceptAssignment: (assignmentId: string) => 
    api.put(`/reviews/${assignmentId}/accept`),

  declineAssignment: (assignmentId: string, reason?: string) => 
    api.put(`/reviews/${assignmentId}/decline`, { reason }),

  submitReview: (manuscriptId: string, reviewData: ReviewFormData) =>
    api.post(`/reviews/${manuscriptId}/submit`, reviewData),

  updateReview: (reviewId: string, reviewData: Partial<ReviewFormData>) =>
    api.put(`/reviews/${reviewId}`, reviewData),
};

export {api};