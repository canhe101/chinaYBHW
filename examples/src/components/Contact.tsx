import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加表单提交逻辑
    toast({
      title: "消息已发送！",
      description: "感谢您的联系，我会尽快回复您。",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "邮箱",
      content: "xxxxx@163.com",
      action: "mailto:xxxxx@163.com"
    },
    {
      icon: "📱",
      title: "微信",
      content: "AlexChen_Design",
      action: "#"
    },
    {
      icon: "🔗",
      title: "LinkedIn",
      content: "linkedin.com/in/alexchen",
      action: "https://linkedin.com/in/alexchen"
    },
    {
      icon: "🐙",
      title: "GitHub",
      content: "github.com/alexchen",
      action: "https://github.com/alexchen"
    }
  ];

  const socialLinks = [
    { name: "微信", icon: "💬", color: "from-green-500 to-green-600" },
    { name: "微博", icon: "📱", color: "from-red-500 to-red-600" },
    { name: "LinkedIn", icon: "🔗", color: "from-blue-500 to-blue-600" },
    { name: "Dribbble", icon: "🏀", color: "from-pink-500 to-pink-600" },
    { name: "Behance", icon: "🎨", color: "from-blue-400 to-blue-500" }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">

      </div>
    </section>
  );
};

export default Contact;