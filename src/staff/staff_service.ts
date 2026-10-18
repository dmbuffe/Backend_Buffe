import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class StaffService {
  constructor(private db: DatabaseService) {}

  private pool() {
    return this.db.getPool();
  }

  async createStaff(
    staff_name: string,
    staff_contactno: string,
    id: number,
    role: string = 'staff',
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO staff (staff_name, staff_contactno, id, role) VALUES (?, ?, ?, ?)',
      [staff_name, staff_contactno, id, role],
    );

    return {
      staff_id: result.insertId,
      staff_name,
      staff_contactno,
      id,
      role,
    };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT staff_id, staff_name, staff_contactno, id, role, refresh_token, created_at, updated_at FROM staff WHERE staff_id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT staff_id, staff_name, staff_contactno, id, role, created_at, updated_at FROM staff',
    );
    return rows;
  }

  async updateStaff(
    id: number,
    partial: {
      staff_name?: string;
      staff_contactno?: string;
      id?: number;
      role?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.staff_name) {
      fields.push('staff_name = ?');
      values.push(partial.staff_name);
    }
    if (partial.staff_contactno) {
      fields.push('staff_contactno = ?');
      values.push(partial.staff_contactno);
    }
    if (partial.id !== undefined) {
      fields.push('id = ?');
      values.push(partial.id);
    }
    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE staff SET ${fields.join(', ')} WHERE staff_id = ?`;

    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteStaff(id: number) {
    await this.pool().execute<OkPacket>(
      'DELETE FROM staff WHERE staff_id = ?',
      [id],
    );
    return true;
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE staff SET refresh_token = ? WHERE staff_id = ?',
      [refreshToken, id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT staff_id, staff_name, role FROM staff WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}