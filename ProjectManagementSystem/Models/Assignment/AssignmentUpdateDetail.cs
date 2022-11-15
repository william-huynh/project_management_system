﻿using ProjectManagementSystem.Models.Sprint;
using System;

namespace ProjectManagementSystem.Models.Assignment
{
    public class AssignmentUpdateDetail
    {
        public string Id { get; set; }
        public string AssignmentCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public string CategoryName { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public int Point { get; set; }
        public string Status { get; set; }
        public string ProjectId { get; set; }
        public string SprintId { get; set; }
        public SprintDetailsDto Sprint { get; set; }
        public string DeveloperId { get; set; }
        public string DeveloperName { get; set; }
    }
}
