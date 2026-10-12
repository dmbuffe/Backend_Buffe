import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class VehicleService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createVehicle(
    vehicle_number: number,
    vehicle_type: string,
    role = 'vehicle',
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO vehicle (vehicle_number, vehicle_type, role) VALUES (?, ?, ?)',
      [vehicle_number, vehicle_type, role],
    );

    return {
      vehicle_id: result.insertId,
      vehicle_number,
      vehicle_type,
      role,
    };
  }

  async findById(vehicle_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT vehicle_id, vehicle_number, vehicle_type, role, refresh_token FROM vehicle WHERE vehicle_id = ?',
      [vehicle_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT vehicle_id, vehicle_number, vehicle_type, role, created_at FROM vehicle',
    );
    return rows;
  }

  async updateVehicle(
    vehicle_id: number,
    partial: {
      vehicle_number?: number;
      vehicle_type?: string;
      role?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.vehicle_number !== undefined) {
      fields.push('vehicle_number = ?');
      values.push(partial.vehicle_number);
    }

    if (partial.vehicle_type) {
      fields.push('vehicle_type = ?');
      values.push(partial.vehicle_type);
    }

    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }

    if (fields.length === 0) return await this.findById(vehicle_id);

    values.push(vehicle_id);
    const sql = `UPDATE vehicle SET ${fields.join(', ')} WHERE vehicle_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(vehicle_id);
  }

  async deleteVehicle(vehicle_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM vehicle WHERE vehicle_id = ?',
      [vehicle_id],
    );
    return res.affectedRows > 0;
  }

  async setRefreshToken(vehicle_id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE vehicle SET refresh_token = ? WHERE vehicle_id = ?',
      [refreshToken, vehicle_id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT vehicle_id, vehicle_number, role FROM vehicle WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}