class LocalAssignment {
  const LocalAssignment({
    required this.id,
    required this.title,
    required this.grade,
    required this.missionId,
    required this.subject,
  });

  final String id;
  final String title;
  final int grade;
  final String missionId;
  final String subject;

  Map<String, Object> toJson() => {
    'id': id,
    'title': title,
    'grade': grade,
    'missionId': missionId,
    'subject': subject,
  };

  factory LocalAssignment.fromJson(Map<String, dynamic> json) {
    final grade = json['grade'] as int;
    if (grade < 1 || grade > 4) {
      throw const FormatException('Invalid assignment grade');
    }
    return LocalAssignment(
      id: json['id'] as String,
      title: json['title'] as String,
      grade: grade,
      missionId: json['missionId'] as String,
      subject: json['subject'] as String,
    );
  }
}
