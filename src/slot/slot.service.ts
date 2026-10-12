import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SlotService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createSlot(
    floor_level: string,
    slot_status: string,
    slot_number: number,
    vehicle_id: number,
    role = 'parking_slot',
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO slot (floor_level, slot_status, slot_number, vehicle_id, role) VALUES (?, ?, ?, ?, ?)',
      [floor_level, slot_status, slot_number, vehicle_id, role],
    );

    return {
      slot_id: result.insertId,
      floor_level,
      slot_status,
      slot_number,
      vehicle_id,
      role,
    };
  }

  async findById(slot_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT slot_id, floor_level, slot_status, slot_number, vehicle_id, role, refresh_token FROM slot WHERE slot_id = ?',
      [slot_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT slot_id, floor_level, slot_status, slot_number, vehicle_id, role, created_at FROM slot',
    );
    return rows;
  }

  async updateSlot(
    slot_id: number,
    partial: {
      floor_level?: string;
      slot_status?: string;
      slot_number?: number;
      vehicle_id?: number;
      role?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.floor_level) {
      fields.push('floor_level = ?');
      values.push(partial.floor_level);
    }

    if (partial.slot_status) {
      fields.push('slot_status = ?');
      values.push(partial.slot_status);
    }

    if (partial.slot_number !== undefined) {
      fields.push('slot_number = ?');
      values.push(partial.slot_number);
    }

    if (partial.vehicle_id !== undefined) {
      fields.push('vehicle_id = ?');
      values.push(partial.vehicle_id);
    }

    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }

    if (fields.length === 0) return await this.findById(slot_id);

    values.push(slot_id);
    const sql = `UPDATE slot SET ${fields.join(', ')} WHERE slot_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(slot_id);
  }

  async deleteSlot(slot_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM slot WHERE slot_id = ?',
      [slot_id],
    );
    return res.affectedRows > 0;
  }

  async setRefreshToken(slot_id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE slot SET refresh_token = ? WHERE slot_id = ?',
      [refreshToken, slot_id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT slot_id, slot_number, role FROM slot WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}