import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PaymentService {
  constructor(private db: DatabaseService) {}

  private pool() {
    return this.db.getPool();
  }

  async createPayment(
    payment_date: string,
    payment_amount: number,
    payment_method: string,
    record_id: number,
    role: string = 'payment',
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO payment (payment_date, payment_amount, payment_method, record_id, role) VALUES (?, ?, ?, ?, ?)',
      [payment_date, payment_amount, payment_method, record_id, role],
    );

    return {
      payment_id: result.insertId,
      payment_date,
      payment_amount,
      payment_method,
      record_id,
      role,
    };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, payment_date, payment_amount, payment_method, record_id, role, refresh_token, created_at, update_at FROM payment WHERE payment_id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, payment_date, payment_amount, payment_method, record_id, role, created_at, update_at FROM payment',
    );
    return rows;
  }

  async updatePayment(
    id: number,
    partial: {
      payment_date?: string;
      payment_amount?: number;
      payment_method?: string;
      record_id?: number;
      role?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.payment_date) {
      fields.push('payment_date = ?');
      values.push(partial.payment_date);
    }
    if (partial.payment_amount !== undefined) {
      fields.push('payment_amount = ?');
      values.push(partial.payment_amount);
    }
    if (partial.payment_method) {
      fields.push('payment_method = ?');
      values.push(partial.payment_method);
    }
    if (partial.record_id !== undefined) {
      fields.push('record_id = ?');
      values.push(partial.record_id);
    }
    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE payment SET ${fields.join(', ')} WHERE payment_id = ?`;

    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deletePayment(id: number) {
    await this.pool().execute<OkPacket>(
      'DELETE FROM payment WHERE payment_id = ?',
      [id],
    );
    return true;
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE payment SET refresh_token = ? WHERE payment_id = ?',
      [refreshToken, id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, payment_amount, role FROM payment WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}