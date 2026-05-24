import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const paymentsService = {
  async getAll(buildingId) {
    const q = query(collection(db, 'payments'), where('buildingId', '==', buildingId), orderBy('dueDate', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async getByUser(userId, buildingId) {
    const q = query(collection(db, 'payments'), where('buildingId', '==', buildingId), where('userId', '==', userId), orderBy('dueDate', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async add(data) {
    return addDoc(collection(db, 'payments'), { ...data, createdAt: serverTimestamp(), status: 'pending' });
  },
  async markPaid(paymentId, method = 'manual') {
    return updateDoc(doc(db, 'payments', paymentId), { status: 'paid', paidAt: serverTimestamp(), paymentMethod: method });
  },
  async delete(paymentId) {
    return deleteDoc(doc(db, 'payments', paymentId));
  },
  async getSummary(buildingId) {
    const payments = await this.getAll(buildingId);
    const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const paid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0);
    return { total, paid, pending, count: payments.length };
  },
};

export const announcementsService = {
  async getAll(buildingId) {
    const q = query(collection(db, 'announcements'), where('buildingId', '==', buildingId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async add(data) {
    return addDoc(collection(db, 'announcements'), { ...data, createdAt: serverTimestamp(), isPinned: false });
  },
  async update(id, data) {
    return updateDoc(doc(db, 'announcements', id), { ...data, updatedAt: serverTimestamp() });
  },
  async delete(id) {
    return deleteDoc(doc(db, 'announcements', id));
  },
  async pin(id, isPinned) {
    return updateDoc(doc(db, 'announcements', id), { isPinned });
  },
};

export const vendorsService = {
  async getAll(buildingId) {
    const q = query(collection(db, 'vendors'), where('buildingId', '==', buildingId), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async add(data) {
    return addDoc(collection(db, 'vendors'), { ...data, createdAt: serverTimestamp(), rating: 0, jobCount: 0 });
  },
  async update(id, data) {
    return updateDoc(doc(db, 'vendors', id), { ...data, updatedAt: serverTimestamp() });
  },
  async delete(id) {
    return deleteDoc(doc(db, 'vendors', id));
  },
};

export const maintenanceService = {
  async getAll(buildingId) {
    const q = query(collection(db, 'maintenance'), where('buildingId', '==', buildingId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async add(data) {
    return addDoc(collection(db, 'maintenance'), { ...data, createdAt: serverTimestamp(), status: 'open' });
  },
  async updateStatus(id, status, vendorId = null) {
    return updateDoc(doc(db, 'maintenance', id), { status, vendorId, updatedAt: serverTimestamp() });
  },
  async delete(id) {
    return deleteDoc(doc(db, 'maintenance', id));
  },
};

export const residentsService = {
  async getAll(buildingId) {
    const q = query(collection(db, 'users'), where('buildingId', '==', buildingId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
};
