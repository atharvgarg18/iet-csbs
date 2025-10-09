import { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { DashboardStatsResponse } from "@shared/api";

// Get dashboard statistics
export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.error('Error counting users:', usersError);
    }

    // Get active users count (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: activeUsers, error: activeUsersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', thirtyDaysAgo.toISOString());

    if (activeUsersError) {
      console.error('Error counting active users:', activeUsersError);
    }

    // Get total batches count
    const { count: totalBatches, error: batchesError } = await supabaseAdmin
      .from('batches')
      .select('*', { count: 'exact', head: true });

    if (batchesError) {
      console.error('Error counting batches:', batchesError);
    }

    // Get total notes count
    const { count: totalNotes, error: notesError } = await supabaseAdmin
      .from('notes')
      .select('*', { count: 'exact', head: true });

    if (notesError) {
      console.error('Error counting notes:', notesError);
    }

    // Get total papers count
    const { count: totalPapers, error: papersError } = await supabaseAdmin
      .from('papers')
      .select('*', { count: 'exact', head: true });

    if (papersError) {
      console.error('Error counting papers:', papersError);
    }

    // Get total notices count
    const { count: totalNotices, error: noticesError } = await supabaseAdmin
      .from('notices')
      .select('*', { count: 'exact', head: true });

    if (noticesError) {
      console.error('Error counting notices:', noticesError);
    }

    const response: DashboardStatsResponse = {
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalBatches: totalBatches || 0,
        totalNotes: totalNotes || 0,
        totalPapers: totalPapers || 0,
        totalNotices: totalNotices || 0,
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};