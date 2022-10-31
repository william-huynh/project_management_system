﻿using System;

namespace ProjectManagementSystem.Models.Assignment
{
    public class AssignmentUpdateDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Point { get; set; }
        public string CategoryId { get; set; }
        public string SprintId { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public string DeveloperId { get; set; }
    }
}