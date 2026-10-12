import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class TimexService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createTimex(
    entry_time: string,
    exit_time: string,
    role = 'time',
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO timex (entry_time, exit_time, role) VALUES (?, ?, ?)',
      [entry_time, exit_time, role],
    );

    return {
      record_id: result.insertId,
      entry_time,
      exit_time,
      role,
    };
  }

  async findById(record_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT record_id, entry_time, exit_time, role, refresh_token FROM timex WHERE record_id = ?',
      [record_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT record_id, entry_time, exit_time, role, created_at FROM timex',
    );
    return rows;
  }

  async updateTimex(
    record_id: number,
    partial: {
      entry_time?: string;
      exit_time?: string;
      role?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.entry_time) {
      fields.push('entry_time = ?');
      values.push(partial.entry_time);
    }

    if (partial.exit_time) {
      fields.push('exit_time = ?');
      values.push(partial.exit_time);
    }

    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }

    if (fields.length === 0) return await this.findById(record_id);

    values.push(record_id);
    const sql = `UPDATE timex SET ${fields.join(', ')} WHERE record_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(record_id);
  }

  async deleteTimex(record_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM timex WHERE record_id = ?',
      [record_id],
    );
    return res.affectedRows > 0;
  }

  async setRefreshToken(record_id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE timex SET refresh_token = ? WHERE record_id = ?',
      [refreshToken, record_id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT record_id, entry_time, role FROM timex WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}